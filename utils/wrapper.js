import cookie from 'utils/cookies';

const wrapper = handler => {

  return async (req, res) => {

  res.cookieArray = [];
  res.cookie = (name, value, options) => cookie(res, name, value, options);
  res.sendCookies = () => res.setHeader('set-cookie', res.cookieArray);

  res.locals = {};

  /* handle SQL errors, send 500 status by default */
  res.handleErrors = result => {
    if (result.error) {
      console.log('error: ', result.error.message)
      throw new Error(result.error);
    };
  };

  /* if message, it sends data back for frontend to handle
     if no message, it throws an error / 500 status */
  res.handleEmptyResult = (result, message) => {
    // first check if affected rows is less than one
    if (result.affectedRows) {
      if (result.affectedRows === 0) {
        if (!message) message = 'Did not affect any rows in db';
        throw new Error(message);
        // if (message) res.json(message)
        // else throw new Error('Did not affect any rows in db')
      };
    /* not all queries hav affectedRows property... some queries return data
       in that case, if no data is returned, flag it */
    } else if (result[0] === undefined) {
      if (!message) message = 'Did not affect any rows in db';
      throw new Error(message);
      // if (message) res.json(message)
      // else throw new Error('Did not return any data from db')
    };
  };
    
    return handler(req, res);
  };
};

module.exports = wrapper;