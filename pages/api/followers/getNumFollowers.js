import wrapper from 'utils/wrapper';
import followerController from 'controllers/followerController';

/**
 * When user loads followers list from dashboard
 */

const handler = async (req, res) => {

  try {
    res.locals.profileUsername = req.body.profileUsername;

    /* follow the user */
    await followerController.getNumFollowers(req, res);
    if (res.finised) return;
    /* get the updated followers list to return */
    await followerController.getNumFollowing(req, res);
    if (res.finised) return;

    return res.json({
      numFollowers: res.locals.numFollowers,
      numFollowing: res.locals.numFollowing
    });
  }
  catch(e) {
    console.log('error in api/followers/followUser', e);
    return res.status(500).send(e.message);
  };
};

export default wrapper(handler);
