import wrapper from 'utils/wrapper';
import followerController from 'controllers/followerController';

/**
 * When user loads followees list from dashboard
 */

const handler = async (req, res) => {

  try {
    res.locals.follower = req.body.profileUsername;

    /* get list of who user is following */
    await followerController.getFollowing(req, res);
    if (res.finised) return;

    return res.json({
      following: res.locals.following
    });
  }
  catch(e) {
    console.log('error in api/followers/getFollowers', e);
    return res.status(500).send(e.message);
  };
};

export default wrapper(handler);
