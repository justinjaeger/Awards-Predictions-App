import db from 'lib/db';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let r;
const testController = {};

/**
 * Create and return a hashed password
 * @param {string} password 
 * @returns {string} hashed password
 */
testController.hashPassword = async (password) => {
  r = await bcrypt.hash(password, 8);
  if (r.error) console.log(r.error);
  let hashedPass = r;
  return hashedPass;
};

/**
 * Create a new user
 * @param {string} email 
 * @param {string} username 
 * @param {string} password
 */
testController.createUser = async (email, username, hashedPass) => {
  r = await db.query(`
  INSERT INTO users(email, username, password)
  VALUES('${email}', '${username}', '${hashedPass}')
  `);
  if (r.error) console.log(r.error);
};
  
/**
 * Retrieves and returns user_id
 * @param {string} username 
 * @returns {integer} user_id
 */
testController.getUserId = async (username) => {
  r = await db.query(`
    SELECT user_id FROM users WHERE username='${username}'
  `);
  if (r.error) console.log(r.error);
  const user_id = r[0].user_id;
  return user_id;
};

/**
 * Creates, stores, and returns access_token
 * @param {string} username 
 * @returns {string} access_token
 */
testController.getAccessToken = async (user_id, username) => {
  const access_token = jwt.sign({user_id}, process.env.ACCESS_TOKEN_SECRET);
  r = await db.query(`
    INSERT INTO tokens(access_token, user_id, username)
    VALUES('${access_token}', ${user_id}, '${username}')
  `);
  if (r.error) console.log(r.error);
  return access_token;
};

/**************************/
module.exports = testController;