import db from 'lib/db';
import logout from 'pages/api/login/logout';
import testController from 'controllers/testController'

const username = process.env.TEST_USERNAME;
const email = process.env.TEST_EMAIL;
const password = process.env.TEST_PASSWORD;
let hashedPass, user_id, access_token;

describe('/login/logout', () => {
  let req, res, r;

  beforeAll(async() => {

    hashedPass = await testController.hashPassword(password);
    await testController.createUser(email, username, hashedPass);
    user_id = await testController.getUserId(username);
    access_token = await testController.getAccessToken(user_id, username);

    /* Mock req and res objects */
    req = {
      cookies: { access_token: `${access_token}` }
    };
    res = {
      status: jest.fn(() => res),
      end: jest.fn(),
      json: jest.fn(), // I want this to set res.finished to true
      send: jest.fn(),
      setHeader: jest.fn(),
      finished: false
    };

    /* call the actual function */
    await logout(req, res);
  });

  afterAll(async() => {
    /* Delete the user */
    if (db.isTestingDb === true) {
      console.log('tis the testing db')
      r = await db.query(`
        DELETE FROM users WHERE username="${username}"
      `);
      if (r.error) console.log(r.error);
    }
    /* Delete the tokens */
    r = await db.query(`
      DELETE FROM tokens WHERE access_token="${access_token}"
    `);
    if (r.error) console.log(r.error);
  });

  /**************************/

  it('should delete the access token from database', async () => {
    r = await db.query(`
      SELECT user_id FROM tokens WHERE access_token="${access_token}"
    `);
    if (r.error) console.log(r.error);
    // I'm not sure this tests for what I think it does... cause wouldn't that be undefined even if it didnt delete it
    expect(r[0]).toBe(undefined);
  });

  it('should have only called res.json once', () => {
    // ...any more calls would mean it threw an error and finished early
    expect(res.json).toHaveBeenCalledTimes(1);
  });

})