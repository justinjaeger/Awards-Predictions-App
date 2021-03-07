const { encrypt } = require('utils/encrypt');
const mailHelper = require('utils/mailHelper');

const emailController = {};
let result;

/*************************************/

emailController.sendVerificationEmail = (req, res) => {

  console.log('sendVerificationEmail')

  const { email, username } = res.locals;

  /* Create the URL that takes the user to reset password page */
  const encryptedUsername = encrypt(username); // encrypts username so we can safetly use it in url
  const encodedUsername = encodeURIComponent(encryptedUsername); // encodes it because encryption will put weird characters in that will otherwise mess up the route
  const url = `http://localhost:3000/api/signup/verifyEmail/?username=${encodedUsername}`;

  /* utilizes the helper function */
  const { transport, emailVerificationOptions } = mailHelper(email, url, username);

  /* Actually sends the email */
  result = transport.sendMail(emailVerificationOptions);
  res.handleErrors(result);
};

/*************************************/

emailController.sendResetPasswordEmail = (req, res) => {

  console.log('sendResetPasswordEmail')

  const { email } = res.locals;

  /* Create the URL that takes the user to reset password page */
  const DEV_ROUTE = process.env.DEV_ROUTE;
  const encryptedEmail = encrypt(email); // encrypts username so we can safetly use it in url
  const encodedEmail = encodeURIComponent(encryptedEmail); // encodes it because encryption will put weird characters in that will otherwise mess up the route
  const url = `${DEV_ROUTE}/api/login/servePassResetPage/?email=${encodedEmail}`;

  /* utilizes the mail helper function */
  const { transport, passwordResetOptions } = mailHelper(email, url);
  
  /* Actually sends the email */
  result = transport.sendMail(passwordResetOptions);
  res.handleErrors(result);
};

/*************************************/


module.exports = emailController;