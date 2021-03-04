import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FollowerList from 'components/dashboardComponents/FollowerList';
import DragAndDrop from 'components/wrappers/DragAndDrop';
import Modal from 'components/wrappers/Modal';

function Dashboard(props) { 

  const { 
    loggedIn, 
    profileUsername,
    username, 
    profileImage,
  } = props;
  const [numFollowers, setNumFollowers] = useState(props.numFollowers);
  const [numFollowing, setNumFollowing] = useState(props.numFollowing);
  const [followingUser, setFollowingUser] = useState(props.followingUser);
  const [modal, setModal] = useState(false);
  const [file, setFile] = useState("");

  console.log(followingUser)

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

  async function handleProfileImageUpload(e) {
    const file = e.target.files[0];
    const filename = encodeURIComponent(file.name);

    const url = `/api/image/upload-url?file=${filename}`;
    const formData = new FormData();
    formData.append(filename, file);
    console.log('formdata', formData)

    await fetch(url, {
      method: 'POST',
      body: formData,
      // 'Content-Type': 'image/jpg',
    })
      .then(res => res.json())
      .then(res => {
        console.log('final:', res);
      })
  };
  

  /* Load the skeleton until the data has been fetched */
  return (
    <div id="dashboard-content">

      <label htmlFor="file-upload">
          <div>
            <img src={profileImage} className="profile-image-lg dashboard-profile-image"/>
            <div id="dashboard-image-hover" >Upload Image</div>
          </div>
      </label>
      <input id="file-upload" type="file" onChange={handleProfileImageUpload}/>

      <div id="dashboard info">
        { !isMyProfile &&
          <div id="profile-name" >{profileUsername}</div>
        }

        { isMyProfile &&
          <div id="profile-name" >Welcome, {profileUsername}</div>
        }

        { !isMyProfile && loggedIn && [
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
