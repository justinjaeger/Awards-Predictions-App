import wrapper from 'utils/wrapper';
import userController from 'controllers/userController';

/**
 * After user creates a new profile picture, this saves it to DB
 */

const handler = async (req, res) => {

  try {
    res.locals.username = req.body.username;
    res.locals.url = req.body.newUrl;
 
    /* Return User Data - use it to authenticate */
    await userController.saveProfileImage(req, res);
    if (res.finished) return;
    
    return res.json({});
  }
  catch(e) {
    console.log('error ', e);
    return res.status(500).send(e.message);
  };
};

export default wrapper(handler);
