import wrapper from 'utils/wrapper';
import signupController from 'controllers/signupController';

/**
 * When the user clicks 'Incorrect Email'
 */

const handler = async (req, res) => {

  try {
    res.locals.email = req.body.email;
  
    /* Delete User */
    await signupController.deleteUser(req, res);
    if (res.finished) return;
    
    /* Set verification cookie in browser */
    // LATER MAKE THIS LOCAL STORAGE
    console.log('about to delete cookie')
    res.cookie('sent_verification');

    res.sendCookies();
    return res.json({
      message: `Account reset - please enter new email.`
    });
  } 
  catch(e) {
    console.log('error ', e);
    return res.status(500).send(e.message);
  };

};

export default wrapper(handler);
