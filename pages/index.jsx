import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cookies from 'next-cookies';
import Header from 'containers/Header';
import parseCookies from 'utils/parseCookies';
import Notification from 'components/Notification';

export default function Home(props) { 

  // Determine the url based on the environment
  const URL = (() => {
    switch(process.env.NODE_ENV) {
      case 'development':
        return 'localhost:3000'
      case 'production':
        return 'localhost:3000'
    };
  })();

  return (
    <>
      <Header 
        loggedIn={props.loggedIn}
        loginDropdown={props.loginDropdown}
        loginRoute={props.loginRoute}
        loginMessage={props.loginMessage}
        loginError={props.loginError}
        username={props.username}
        email={props.email}
        notification={props.notification}
        image={props.image}
        URL={URL}
      />
    </>
  );
};

/**
 * Fetch all SSR (user specific) props
 * Begin by declaring all props' default values
 * Depending on what cookies we have and the access token validation,
 * populate the app with specific data
 */

export async function getServerSideProps(context) {

  /* Default values for all props */
  
  const props = { 
    loggedIn: false,
    loginDropdown: false,
    loginRoute: '/',
    loginMessage: '',
    loginError: '',
    username: '',
    email: '',
    notification: false,
    image: '/PROFILE.png',
  };

  /* Handle cookies */

  const c = cookies(context); // for getting cookies

  if (c.sent_verification) { // cookie exists after you sign up but NOT after you authenticate email
    const username = c.sent_verification.split('*$%&')[0]
    const email = c.sent_verification.split('*$%&')[1]
    props.email = email;
    props.username = username;
    props.notification = 'please verify email';
  };

  if (c.authenticated) { // cookie exists after you authenticate email
    const username = c.authenticated;
    props.loginRoute = '/login';
    props.loginDropdown = true;
    props.username = username;
    props.loginMessage = 'Email verified. Please enter your password.';
  };

  if (c.reset_password) { // cookie exists after you reset password
    const email = c.reset_password;
    props.loginRoute = '/resetPassword';
    props.loginDropdown = true;
    props.email = email;
    props.loginMessage = `Please enter a new password for ${email}.`;
  };

  /**
   * This is basically what logs you in.
   * If access token exists, verify it. 
   * If verified, populate the page with appropriate user data
   */
  if (c.access_token) { // cookie exists when you are logged in

    const payload = { access_token: c.access_token };
    /**
     * Request to verify token
     * The route here is selected based on what is going to load from this file (index.jsx)
     * We need the username to say "Hi, Username" for home page, and this loads the home page
     * For other prediction pages which will check the cookie, we'll put a slug there to tell it to send back more data
     * - so long as sticking with SSR, can also just do static loading skeleton w/ client side fetching
     */
    await axios.post(`${process.env.DEV_ROUTE}/api/auth`, payload)
      .then(res => {
        /* If token is verified, set props accordingly */
        if (res.data.loggedIn) {
          props.loggedIn = true;
          props.username = res.data.username;
          if (res.data.image) props.image = res.data.image;
        };  
        /* sets cookies on client (HAVE to do this for getServerSideProps) */
        parseCookies(res.data.cookieArray, context);
      })
      .catch(err => {
        console.log('something went wrong while verifying access token', err);
      })
  };

  /* Return the final props object */
  return { props };
} 
