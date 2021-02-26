import db from 'lib/db';

const userOtherController = {};
let result;

/*************************************/

userOtherController.getProfileImage = async (req, res) => {

  console.log('getProfileImage')

  const { profileUsername } = res.locals;

  result = await db.query(`
    SELECT image FROM users 
    WHERE username='${profileUsername}' 
  `);
  res.handleErrors(result);

  console.log('fetch image result', result)

  res.locals.profileImage = result[0].image;
};

/*************************************/

userOtherController.checkUserExists = async (req, res) => {

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

module.exports = userOtherController;