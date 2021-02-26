import db from 'lib/db';

const userMeController = {};
let result;

/*************************************/

userMeController.getUsername = async (req, res) => {

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

userMeController.dashboard = async (req, res) => {

  console.log('userMeController.dashboard')

  const { user_id } = res.locals;

  result = await db.query(`
    SELECT username, image
    FROM users 
    WHERE user_id=${user_id} 
  `);
  res.handleErrors(result);
  res.handleEmptyResult(result);

  res.locals.username = result[0].username;
  res.locals.profileImage = result[0].image;
};

/*************************************/

module.exports = userMeController;