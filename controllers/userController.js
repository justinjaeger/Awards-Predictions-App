import db from 'lib/db';

const userController = {};
let result, query;

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

userController.dashboard = async (req, res) => {

  console.log('dashboard')

  const { user_id } = res.locals;

  result = await db.query(`
    SELECT username, image
    FROM users 
    WHERE user_id=${user_id} 
  `);
  res.handleErrors(result);
  res.handleEmptyResult(result);

  console.log('result', result)

  res.locals.username = result[0].username;
  res.locals.profileImage = result[0].image;
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

  console.log('result', result)

  res.locals.profileImage = result[0].image;
};

/*************************************/

module.exports = userController;