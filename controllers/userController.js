import db from 'lib/db';

const userController = {};
let result;

/*************************************/

userController.getUsername = async (req, res) => {

  console.log('getUsername')

  const { user_id } = res.locals;

  result = await db.query(`
    SELECT username 
    FROM users 
    WHERE user_id=${user_id} 
  `);
  res.handleErrors(result);
  res.handleEmptyResult(result);

  res.locals.username = result[0].username;
};

/*************************************/

userController.header = async (req, res) => {

  console.log('header')

  const { user_id } = res.locals;

  /* Get the username and image */
  result = await db.query(`
    SELECT username, image
    FROM users 
    WHERE user_id=${user_id} 
  `);
  res.handleErrors(result);
  res.handleEmptyResult(result);

  res.locals.username = result[0].username;
  res.locals.image = result[0].image;
};

/*************************************/

userController.getProfileImage = async (req, res) => {

  console.log('getProfileImage')

  const { profileUsername } = res.locals;

  result = await db.query(`
    SELECT image FROM users 
    WHERE username='${profileUsername}' 
  `);
  res.handleErrors(result);

  let finalImage = (result[0].image)
    ? result[0].image
    : '/PROFILE.png'

  res.locals.profileImage = finalImage;
};

/*************************************/

userController.checkUserExists = async (req, res) => {

  console.log('checkUserExists')

  const { profileUsername } = res.locals;

  result = await db.query(`
    SELECT user_id FROM users 
    WHERE username='${profileUsername}' 
  `);
  res.handleErrors(result);

  if (!result.length) res.locals.send404 = true;
};

/*************************************/

module.exports = userController;