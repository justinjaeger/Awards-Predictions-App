import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FollowerList from 'components/dashboardComponents/FollowerList';
import Modal from 'components/wrappers/Modal';
import Notification from 'components/Notification';

function Dashboard(props) { 

  const { 
    loggedIn, 
    profileUsername,
    username, 
  } = props;
  const [profileImage, setProfileImage] = useState(props.profileImage);
  const [numFollowers, setNumFollowers] = useState(props.numFollowers);
  const [numFollowing,] = useState(props.numFollowing);
  const [followingUser, setFollowingUser] = useState(props.followingUser);
  const [notification, setNotification] = useState(false);
  const [modal, setModal] = useState(false);

  /* Determine if page is YOUR profile or someone else's */
  const isMyProfile = (username === profileUsername) ? true : false;

  /* FOLLOW USER */
  function followUser(profileUsername, username) {
    axios.post('/api/followers/followUser', { profileUsername, username })
      .then(res => {
        setFollowingUser(true);
        /* update the following number */
        setNumFollowers(numFollowers+1);
      })
      .catch(err => {
        if (err) console.log('something went wrong fetching followers', err);
      })
  };

  /* UNFOLLOW USER */
  function unfollowUser(profileUsername, username) {
    console.log('clicked unfollow user')
    axios.post('/api/followers/unfollowUser', { profileUsername, username })
      .then(res => {
        setFollowingUser(false);
        /* update the following number */
        setNumFollowers(numFollowers-1);
      })
      .catch(err => {
        if (err) console.log('something went wrong fetching followers', err);
      })
  };

  /* Upload Profile Image */
  async function handleProfileImageUpload(e) {
    // Get the uploaded file
    const file = e.target.files[0];
    // Create a form with the file in it
    const formData = new FormData();
    formData.append('file', file);
    
    // Check that file is valid type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    let valid = false;
    validTypes.forEach(type => {
      if (file.type === type) valid = true;
    });
    if (!valid) return setNotification('Not a valid image type. Accepts .jpeg / .jpg / .png')

    // Get the previous user image key
    const previousKey = (profileImage === '/PROFILE.png')
      ? null
      : profileImage.slice(52);

    // generate unique new file name
    let randomNumber = Math.floor(Math.random() * 10000)
    const fileName = username + randomNumber + file.name;
    
    // save the image to DO Spaces & get edge url
    let newUrl;
    await fetch(`/api/image/uploadProfileImage?key=${fileName}`, {
      method: 'POST',
      body: formData,
      'Content-Type': 'image/jpg',
    })
      .then(res => res.json())
      .then(res => {
        // convert url to edge url
        newUrl = res.url.slice(0, 24) + '.cdn' + res.url.slice(24);
        setProfileImage(newUrl);
      })
      .catch(err => console.log('error uplßoading image to Spaces', err))

    // If upload was successful...
    if (newUrl) {
      let payload = { username, newUrl };
      // Write image to database
      await axios.post('/api/image/saveProfileImage', payload)
        .then(data => console.log('success saving url'))
        .catch(err => console.log('err saving url',err))
      // Delete previous image from Spaces if there is one
      if (previousKey) {
        await axios.post('/api/image/deleteProfileImage', { previousKey })
        .then(data => console.log('success deleting previous image'))
        .catch(err => console.log('err deleting previous image',err))
      };
    };
  };

  /* Load the skeleton until the data has been fetched */
  return (
    <div id="dashboard-content">

      {notification && 
      <Notification setNotification={setNotification} >
        {notification}
      </Notification> 
      }

      { isMyProfile ? [ 
        /* If IS my profile: */
        <label htmlFor="file-upload">
            <div>
              <img src={profileImage} className="profile-image-lg dashboard-profile-image"/>
              <div id="dashboard-image-hover" >Upload Image</div>
            </div>
        </label>,
        <input id="file-upload" type="file" onChange={handleProfileImageUpload}/>
      ] : [
        /* If NOT my profile: */
        <label htmlFor="file-upload">
              <img src={profileImage} className="profile-image-lg dashboard-profile-image-logout"/>
        </label>
      ]}

      <div id="dashboard info">
        { !isMyProfile &&
          <div id="profile-name" >{profileUsername}</div>
        }

        { isMyProfile &&
          <div id="profile-name" >Welcome, {profileUsername}</div>
        }

        { !isMyProfile && loggedIn && [
          /* If someone else's profile AND logged in: */
          followingUser && 
            <button id="follow-button" onClick={() => unfollowUser(profileUsername, username)}>Unfollow</button>,
          !followingUser && 
            <button id="follow-button" onClick={() => followUser(profileUsername, username)}>Follow</button>
        ]}
        
        <div id="dashboard-follower-buttons">
          <button onClick={() => setModal('follower')} id="follower-button">{numFollowers} followers</button>
          <button onClick={() => setModal('following')} id="follower-button">{numFollowing} following</button>
        </div>
      </div>
    
      { modal &&
        <Modal setModal={setModal} >
          {modal === 'follower' && <div id="follower-title">Followers:</div>}
          {modal === 'following' && <div id="follower-title">Following:</div>}
          <FollowerList 
            title={modal}
            profileUsername={profileUsername}
          />
        </Modal>
      }

    </div>
  );
}

export default Dashboard;
