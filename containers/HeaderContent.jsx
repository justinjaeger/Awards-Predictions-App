import React, { useEffect, useState } from 'react';

import LoggedIn from 'components/headerComponents/LoggedIn';;
import LoggedOut from 'components/headerComponents/LoggedOut';

function Header(props) { 

  const { 
    loggedIn,
    logout,
    setRoute, 
    username, 
    setLoginDropdown,
    setMessage,
    profileImage
  } = props;

  return (
    <div id="Header">

      { !loggedIn &&
        <LoggedOut
          setRoute={setRoute}
          setLoginDropdown={setLoginDropdown}
          setMessage={setMessage}
        />
      }

      { loggedIn &&
        <LoggedIn 
          username={username}
          logout={logout}
          profileImage={profileImage}
        />
      }
      
    </div>
  );
}

export default Header;
