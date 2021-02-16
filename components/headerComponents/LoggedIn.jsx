import React, { useEffect } from 'react';

function LoggedIn(props) { 
  const { username, logout } = props;

  // Determine the url based on the environment
  const route = (() => {
    switch(process.env.NODE_ENV) {
      case 'development':
        return 'localhost:3000'
      case 'production':
        return 'localhost:3000'
    }
  })();
  
  return (
    <>
      <div id="header-message">Welcome, {username}</div>

      <div><a href={`http://${route}/${username}`} className="header-button" >My Profile</a></div>
      
      <button onClick={logout} className="header-button" >Log Out</button>
    </>
  );
}

export default LoggedIn;
