import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cookies from 'next-cookies';
import parseCookies from 'utils/parseCookies';
import { useRouter } from 'next/router';

import Header from 'containers/Header';
import Dashboard from 'containers/Dashboard';

/**
 * /username123
 */

function UserDashboard(props) { 

  // Gets the url slug
  const { username: profileUsername } = useRouter().query;

  console.log('props', props)

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
        notificationBox={props.notificationBox}
      />

      <Dashboard 
        loggedIn={props.loggedIn}
        username={props.username}
        user_id={props.user_id}
        profileUsername={profileUsername}
      />
    </>
  );
}

export default UserDashboard;
 
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
    user_id: false,
    notification: false,
    notificationBox: false,
  };

  /* Handle cookies */

  const c = cookies(context); // for getting cookies

  if (c.sent_verification) { // cookie exists after you sign up but NOT after you authenticate email
    const username = c.sent_verification.split('*$%&')[0]
    const email = c.sent_verification.split('*$%&')[1]
    props.email = email;
    props.username = username;
    props.notification = 'please verify email';
    props.notificationBox = true;
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
    /* Request to verify token -- Route is selected based on what data we need on the dashbaord */
    await axios.post(`${process.env.DEV_ROUTE}/api/user/dashboard`, payload)
      .then(res => {
        /* If token is verified, set props accordingly */
        if (res.data.loggedIn) {
          props.loggedIn = true;
          props.username = res.data.username;
        };  
        /* sets cookies on client (HAVE to do this for getServerSideProps) */
        parseCookies(res.data.cookieArray, context);
      })
      .catch(err => {
        console.log('something went wrong while verifying access token', err);
      })
  };

  /**
   * Here, we COULD load the data on the user's followers and followees...
   * but we're going to leave that to render on the client side and do a skeleton instead
   */

  /* Return the final props object */
  return { props };
} 
