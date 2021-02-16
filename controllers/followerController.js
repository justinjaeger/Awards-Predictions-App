import db from 'lib/db';
const bcrypt = require('bcrypt');

const followerController = {};
let result;

/*************************************/

followerController.getFollowers = async (req, res) => {

  console.log('getFollowers')

  const { profileUsername } = res.locals;

  /* Fetch the user's followers */
  result = await db.query(`
    SELECT follower FROM followers
    WHERE username="${profileUsername}" 
  `);
  res.handleErrors(result);

  const followers = result.map(user => {
    return { username: user.follower }
  });

  res.locals.followers = followers;
};

/*************************************/

followerController.getFollowing = async (req, res) => {

  console.log('getFollowing')

  const { follower } = res.locals;

  /* Fetch who user is following - user is the follower */
  result = await db.query(`
    SELECT username FROM followers
    WHERE follower="${follower}" 
  `);
  res.handleErrors(result);

  const following = result.map(user => {
    return { username: user.username }
  });

  res.locals.following = following;
};

/*************************************/

followerController.followUser = async (req, res) => {

  console.log('followUser')

  const { follower, profileUsername } = res.locals;

  /* Get the current datetime */
  const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  /* Fetch who user is following */
  result = await db.query(`
    INSERT INTO followers(username, follower, dateCreated)
    VALUES("${profileUsername}", "${follower}", "${datetime}")
  `);
  res.handleErrors(result);
};

/*************************************/

followerController.unfollowUser = async (req, res) => {

  console.log('unfollowUser')

  const { follower, profileUsername } = res.locals;

  /* Fetch who user is following */
  result = await db.query(`
    DELETE FROM followers 
    WHERE username="${profileUsername}" AND follower="${follower}"
  `);
  res.handleErrors(result);
};

/*************************************/

export default followerController;