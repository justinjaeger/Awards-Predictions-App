import wrapper from 'utils/wrapper';
import followerController from 'controllers/followerController';

/**
 * When user loads followers list from dashboard
 */

const handler = async (req, res) => {

  try {
    res.locals.profileUsername = req.body.profileUsername;

    /* get the followers list */
    await followerController.getFollowers(req, res);
    if (res.finised) return;

    return res.json({
      followers: res.locals.followers
    });
  }
  catch(e) {
    console.log('error in api/followers/getFollowers', e);
    return res.status(500).send(e.message);
  };
};

export default wrapper(handler);
