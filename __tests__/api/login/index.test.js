import db from 'lib/db';
import login from 'pages/api/login';
import logout from 'pages/api/login/logout';
import signup from 'pages/api/signup';
import testController from 'controllers/testController'

const username = process.env.TEST_USERNAME;
const email = process.env.TEST_EMAIL;
const password = process.env.TEST_PASSWORD;
let hashedPass, user_id, access_token;

describe('/login/index', () => {
  let req, res, r;

  beforeAll(async() => {
    /* Mock req and res objects */
    req = {};
    res = {
      status: jest.fn(() => res),
      end: jest.fn(),
      json: jest.fn((obj) => {
        res.return = obj;
        res.finished = true;
      }), // Would be nice if this set res.finished to true
      send: jest.fn(),
      setHeader: jest.fn(),
      finished: false,
      return: undefined, // let's see if we can make this store whatever is returned when we call res.json, like an error message, etc. Then we can test whatever is returned
    };
  });

  afterAll(async() => {
    /* Delete user from db */
    // IMPORTANT: this clears every entry, so double check that it is from the testing db
    if (db.isTestingDb === true) {

      /* Delete all users from db */
      r = await db.query(`
        DELETE FROM users WHERE user_id>0
      `);
      if (r.error) console.log(r.error);

      /* Delete token from db */
      r = await db.query(`
        DELETE FROM tokens WHERE user_id>0
      `);
      if (r.error) console.log(r.error);
    };
  });

  /**************************/

  it('should send error when input is profane', async () => {
    req.body = {
      email: email,
      username: 'fuck',
      password: password,
      confirmPassword: password,
    }
    /* call the actual function */
    await signup(req, res);
    
    expect(res.finished).toBe(true);
  });

  it('should throw errors when input is duplicate', async () => {
    //
  });

  it('should sign up a user', async () => {
    //
  });

})