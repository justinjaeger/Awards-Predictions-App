import wrapper from 'utils/wrapper';
import userOtherController from 'controllers/userOtherController';
import followerController from 'controllers/followerController';

/**
 * UserOther
 * 
 * Essentially gets called whenever we are trying to get a user's information
 * on a specific page.
 * We know that we have the username in the payload.
 */

const handler = async (req, res) => {

  try {
    /* Get the action from the url string */
    const action = req.query.slug[0];

    /* Get the profile username from the req body */
    res.locals.profileUsername = req.body.profileUsername;
    res.locals.username = res.locals.profileUsername;

    /* Check that a user with this name exists...
      if not, throw a 404 page */
    await userOtherController.checkUserExists(req, res);
    if (res.finished) return;
    if (res.locals.send404) return res.json({ send404: true });

    /* This is the object we return at the end */
    const data = {};

    /* All the below functions modify the data object */
    switch (action) {
      case 'dashboard':
        /* Fetch profile image */
        await userOtherController.getProfileImage(req, res);
        if (res.finished) return;
        /* Get people following user */
        await followerController.getNumFollowers(req, res);
        if (res.finished) return;
        /* Get people user is following */
        await followerController.getNumFollowing(req, res);
        if (res.finished) return;
        /* Put all fetched data in data object */
        data.profileImage = res.locals.profileImage;
        data.numFollowers = res.locals.numFollowers;
        data.numFollowing = res.locals.numFollowing;
        break;

      default: 
    };

    res.sendCookies(); // just for postman but otherwise ineffective
    return res.json(data);
  } 
  catch(e) {
    console.log('error in /userOther/...slug', e);
    return res.status(500).send(e.message);
  };

};

export default wrapper(handler);
