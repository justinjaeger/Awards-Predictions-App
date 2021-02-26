import React, { useEffect } from 'react';

function LoggedIn(props) { 
  const { username, logout, image, URL } = props;

  const pimage = (image === null) ? '/PROFILE.png' : image;
  const space = <span>&nbsp;</span>;
  
  return (
    <>
      <button onClick={logout} className="header-button" >Log Out</button>
      
      <div id="header-message">Welcome,{space}<a href={`http://${URL}/${username}`} className="header-button" >{username}</a></div>
      <a href={`http://${URL}/${username}`} className="header-button">
        <img className="profile-image-xsm header-profile-pic" src={pimage} ></img>
      </a>
    </>
  );
}

export default LoggedIn;
