import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FollowerUnit(props) { 

  const { username, image } = props;

  const link = `/${username}`;
  return (
    <>
      <div id="follower-unit">
        <img className="profile-image-xsm" src={image} />
        <a href={link} className="follower-unit-username" >{username}</a>
      </div>
    </>
  );
}

export default FollowerUnit;
