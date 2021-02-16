import wrapper from 'utils/wrapper';
import tokenController from 'controllers/tokenController';
import userController from 'controllers/userController';
import followerController from 'controllers/followerController';

/**
 * Essentially gets called whenever we see that we have an access token.
 * Needs to verify the access token, refreshing if neccessary,
 * and return the proper data (based on slug) back to the app
 */

const handler = async (req, res) => {

  try {
    /* Get the action from the slug */
    const action = req.query.slug[0];
    res.locals.access_token = req.body.access_token;

    /* Verify the access_token */
    await tokenController.verifyToken(req, res);
    if (res.finished) return;

    /* This is the object we return at the end */
    const data = { 
      loggedIn: false,
    };

    /* All the below functions modify the data object.
       They all fetch data using the user_id in res.locals */
    switch (action) {
      case 'home':
        /* Fetch the username */
        await userController.getUsername(req, res);
        if (res.finished) return;

        data.username = res.locals.username;
        data.loggedIn = true;
        break;

      case 'dashboard':
        /* Fetch the username */
        await userController.getUsername(req, res);
        if (res.finished) return;
        /* Fetch number of followers */
        await followerController.getNumFollowers(req, res);
        if (res.finished) return;
        /* Fetch number of following */
        await followerController.getNumFollowing(req, res);
        if (res.finished) return;

        data.username = res.locals.username;
        data.followerNumber = res.locals.followerNumber;
        data.followingNumber = res.locals.followingNumber
        data.loggedIn = true;
        break;

      default: 
    };

    /* pass cookieArray to the data/output object 
    because we're calling this endpoint from getServerSidePops
    and have to use a special cookie command to get cookies
    to appear in the browser */
    data.cookieArray = res.cookieArray;

    res.sendCookies(); // just for postman but otherwise ineffective
    return res.json(data);
  } 
  catch(e) {
    console.log('error in ...slug', e);
    return res.status(500).send(e.message);
  };

};

export default wrapper(handler);
