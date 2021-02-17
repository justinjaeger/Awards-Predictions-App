import React, { useEffect } from 'react';

function LoggedIn(props) { 
  const { username, logout, profileImage } = props;

  // Determine the url based on the environment
  const route = (() => {
    switch(process.env.NODE_ENV) {
      case 'development':
        return 'localhost:3000'
      case 'production':
        return 'localhost:3000'
    }
  })();

  const image = (profileImage === null) ? '/PROFILE.png' : profileImage;
  const space = <span>&nbsp;</span>;
  
  return (
    <>
      <button onClick={logout} className="header-button" >Log Out</button>
      
      <div id="header-message">Welcome,{space}<a href={`http://${route}/${username}`} className="header-button" >{username}</a></div>
      <a href={`http://${route}/${username}`} className="header-button">
        <img className="profile-image-xsm header-profile-pic" src={image} ></img>
      </a>
    </>
  );
}

export default LoggedIn;
