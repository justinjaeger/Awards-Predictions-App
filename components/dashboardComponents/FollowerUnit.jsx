import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FollowerUnit(props) { 

  const { username } = props;

  const [image, setImage] = useState('/PROFILE.png')

  // Should also load the follow button (need to know if we are following)
  // AND their profile image
  useEffect(async() => {
    /* Fetch the user profile image */
    await axios.post('/api/user/getProfileImage', { profileUsername: username })
        .then(res => {
          if (res.data.profileImage) setImage(res.data.profileImage);
        })
        .catch(err => {
          if (err) console.log('something went wrong with getProfileImage', err);
        })
  }, [])

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
