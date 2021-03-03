import wrapper from 'utils/wrapper';
import imageController from 'controllers/imageController';

/**
 * When the user clicks Log Out
 */

const handler = async (req, res) => {

  try {
    res.locals.file = req.body;

    /* Get image upload */
    await imageController.uploadProfileImage(req, res);
    if (res.finished) return;

    console.log('returned data', res.locals.url)
    
    return res.json({
      location: res.locals.url
    });
  } 
  catch(e) {
    console.log('error in profileUpload', e);
    return res.status(500).send(e.message);
  };

};

export default wrapper(handler);
