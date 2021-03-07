import db from 'lib/db';
const profanityFilter = require('utils/profanityFilter');
const usernameFilter = require('utils/usernameFilter');
const bcrypt = require('bcrypt');

const signupController = {};
let result;

/*************************************/

/**
 * Checks that email and username are formatted properly
 * - determines whether username is valid (no profanity, etc)
 * - note: Imports helper functions from the 'misc' folder
 */

signupController.validateEmailAndUsername = (req, res) => {

  console.log('validateEmailAndUsername')

  const { email, username } = res.locals;

  if (!email.includes('@') || !email.includes('.') ) {
    return res.json({ error: 'This email is not properly formatted.' });
  };

  if (username.length > 20) {
    return res.json({ error: 'Username cannot be more than 20 characters.' });
  };

  const filterResult = usernameFilter(username);
  if (filterResult.status === false) {
    return res.json({ error: filterResult.message });
  };

  if (profanityFilter(username) === true) {
    return res.json({ error: 'Profanity is not allowed in your username' });
  };
};

/*************************************/

signupController.validatePassword = (req, res) => {

  console.log('validatePassword')

  const { password, confirmPassword } = res.locals;

  /* check if passwords match */
  if (password !== confirmPassword) {
    return res.json({ error: 'Passwords do not match.' });
  };

  /* check that password is proper length */
  if (password.length < 8) {
    return res.json({ error: 'Password must be more than 8 characters.' });
  };

  if (password.length > 20) {
    return res.json({ error: 'Password must be less than 20 characters.' });
  };
};

/*************************************/

signupController.hashPassword = async (req, res) => {

  console.log('hashPassword')

  const { password } = res.locals;

  /* hash the password using bcrypt */
  result = await bcrypt.hash(password, 8); 
  res.handleErrors(result);

  /* store the hashed password */
  res.locals.hashedPassword = result;
};

/*************************************/

signupController.createUser = async (req, res) => {

  console.log('createUser')

  const { email, username, hashedPassword } = res.locals;

  /* Create new user in database */
  result = await db.query(`
    INSERT INTO users(email, username, password)
    VALUES('${email}', '${username}', '${hashedPassword}') 
  `); 
  if (result.error) {
    /* Handle duplicate entry errors with an error message */
    if (result.error.code === 'ER_DUP_ENTRY') {
      return (result.error.sqlMessage.split('.')[1] === `username'`)
        ? res.json({ error: 'This username is already registered.' })
        : res.json({ error: 'This email is already registered.' })
    };
    /* If that's not the error, handle it like any other */
    res.handleErrors(result);
  };
  res.handleEmptyResult(result);
};

/*************************************/

signupController.authenticateUser = async (req, res) => {

  console.log('authenticateUser')

  const { username } = res.locals;

  /* Set authentication status to true (0 -> 1) */
  result = await db.query(`
    UPDATE users
    SET authenticated=1
    WHERE username='${username}' 
  `); 
  res.handleErrors(result);
  res.handleEmptyResult(result);
};

/*************************************/

signupController.getUserIdByUsername = async (req, res) => {

  console.log('getUserIdByUsername')

  const { username } = res.locals;

  /* get the user_id from the username */
  result = await db.query(`
    SELECT user_id
    FROM users
    WHERE username='${username}' 
  `); 
  res.handleErrors(result);
  res.handleEmptyResult(result);

  res.locals.user_id = result[0];
};

/*************************************/

signupController.markDateCreated = async (req, res) => {

  console.log('markDateCreated')

  const { username } = res.locals;

  /* get the datetime */
  const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  /* update the 'dateCreated' field with current datetime */
  result = await db.query(`
    UPDATE users
    SET dateCreated = '${datetime}'
    WHERE username = '${username}' 
  `); 
  res.handleErrors(result);
  res.handleEmptyResult(result, 'could not mark date created');
};

/*************************************/

signupController.deleteUser = async (req, res) => {

  console.log('deleteUser')

  const { email } = res.locals;
  console.log('email', email)

  /* delete the user from database */
  result = await db.query(`
    DELETE FROM users
    WHERE email='${email}' 
  `); 
  console.log('result', result)
  res.handleErrors(result);
  res.handleEmptyResult(result, 'did not delete user');
};

/*************************************/

module.exports = signupController;