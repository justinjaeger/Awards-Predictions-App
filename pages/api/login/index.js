import wrapper from 'utils/wrapper';
import tokenController from 'controllers/tokenController';
import loginController from 'controllers/loginController';

/**
 * When the user clicks Log In
 */

const handler = async (req, res) => {

  try {
    res.locals.emailOrUsername = req.body.emailOrUsername;
    res.locals.password = req.body.password;
    res.locals.entryType = (res.locals.emailOrUsername.includes('@')) ? 'email' : 'username';
    /* ^^^ Determine entry type - email or username */

    /* Return User Data - use it to authenticate */
    await loginController.returnUserData(req, res);
    if (res.finished) return;
    /* Verify Password */
    await loginController.verifyPassword(req, res);
    if (res.finished) return;
    /* Verify Email Authentication */
    await loginController.verifyEmailAuthenticated(req, res);
    if (res.finished) return;
    /* Create Access Token */
    await tokenController.createAccessToken(req, res);
    if (res.finished) return;
    
    res.sendCookies();
    return res.json({
      loggedIn: true,
      username: res.locals.username
    });
  }
  catch(e) {
    console.log('error ', e);
    return res.status(500).send(e.message);
  };
};

export default wrapper(handler);
