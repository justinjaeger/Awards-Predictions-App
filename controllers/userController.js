import db from 'lib/db';

const userController = {};
let result, query;

/*************************************/

userController.getUsername = async (req, res) => {

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

module.exports = userController;