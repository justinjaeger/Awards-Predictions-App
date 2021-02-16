import wrapper from 'utils/wrapper';
import followerController from 'controllers/followerController';


const handler = async (req, res) => {

  try {
    res.locals.username = req.body.username;
    res.locals.profileUsername = req.body.profileUsername;

    /* Determine if we are following particular user */
    await followerController.determineFollowing(req, res);
    if (res.finised) return;

    return res.json({
      followingUser: res.locals.followingUser
    });
  }
  catch(e) {
    console.log('error in api/followers/determineFollowing', e);
    return res.status(500).send(e.message);
  };
};

export default wrapper(handler);
