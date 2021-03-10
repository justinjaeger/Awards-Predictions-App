import wrapper from 'utils/wrapper';
import tokenController from 'controllers/tokenController';
import userController from 'controllers/userController';

/**
 * Verifies access token and returns user data for header
 */

const handler = async (req, res) => {

  try {
    /* Get access_token from req.body */
    res.locals.access_token = req.body.access_token;

    /* Verify the access_token */
    await tokenController.verifyToken(req, res);
    if (res.finished) return;

    /* Fetch data for the header */
    await userController.header(req, res);
    if (res.finished) return;

    /* NOTE ON COOKIES: 
    We pass cookieArray to the output object so we can call 
    a special cookie command from getServerSideProps. 
    Any time we write cookies from the server side, we must do this.
    If we write cookies from the client-side, we can call the method below, 
    res.sendCookies, instead.
    I am still using it so it writes cookies in Postman.  */
    res.sendCookies();
    return res.json({
      loggedIn: true,
      username: res.locals.username,
      image: res.locals.image,
      cookieArray: res.cookieArray
    });
  } 
  catch(e) {
    console.log('error in /auth', e);
    return res.status(500).send(e.message);
  };

};

export default wrapper(handler);
