import wrapper from 'utils/wrapper';
import userController from 'controllers/userController';


const handler = async (req, res) => {

  try {
    res.locals.profileUsername = req.body.profileUsername;

    /* Determine if we are following particular user */
    await userController.getProfileImage(req, res);
    if (res.finised) return;

    return res.json({
      profileImage: res.locals.profileImage
    });
  }
  catch(e) {
    console.log('error in api/user/getProfileImage', e);
    return res.status(500).send(e.message);
  };
};

export default wrapper(handler);
