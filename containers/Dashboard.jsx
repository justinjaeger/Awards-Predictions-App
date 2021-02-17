import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'components/dashboardComponents/Modal'

function Dashboard(props) { 

  const { loggedIn, profileUsername, username, profileImage } = props;
  const [numFollowers, setNumFollowers] = useState('');
  const [numFollowing, setNumFollowing] = useState('');
  const [followingUser, setFollowingUser] = useState(false);
  const [modal, setModal] = useState(false);
  const [image, setImage] = useState('/PROFILE.png');

  /* Determine if page is YOUR profile or someone else's */
  const isMyProfile = (username === profileUsername) ? true : false;

  useEffect(async () => {

    /* Fetch the number of followers and following */
    await axios.post('/api/followers/getNumFollowers', { profileUsername })
      .then(res => {
        setNumFollowers(res.data.numFollowers);
        setNumFollowing(res.data.numFollowing);
      })
      .catch(err => {
        if (err) console.log('something went wrong fetching followers', err);
      })

    if (loggedIn) {
      /* Determine if we are following them */
      await axios.post('/api/followers/determineFollowing', { username, profileUsername })
        .then(res => {
          setFollowingUser(res.data.followingUser)
        })
        .catch(err => {
          if (err) console.log('something went wrong fetching followers', err);
        })
    };

    /* Set profile image */
    if (isMyProfile) {
      /* Set profile image */
      if (profileImage !== null) setImage(profileImage);
    } else {
      /* Fetch the profile image from db */
      await axios.post('/api/user/getProfileImage', { profileUsername })
        .then(res => {
          if (res.data.profileImage) setImage(res.data.profileImage);
        })
        .catch(err => {
          if (err) console.log('something went wrong with getProfileImage', err);
        })
    };

  }, []);

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

  /* Load the skeleton until the data has been fetched */
  return (
    <div id="dashboard-content">

      <img src={image} alt="" className="profile-image-lg dashboard-profile-image" />

      <div id="dashboard info">
        { !isMyProfile &&
          <div id="profile-name" >{profileUsername} 's profile</div>
        }

        { isMyProfile &&
          <div id="profile-name" >Welcome, {profileUsername}</div>
        }

        { !isMyProfile && loggedIn && [
          followingUser && 
            <button id="follower-button" onClick={() => unfollowUser(profileUsername, username)}>Unfollow</button>,
          !followingUser && 
            <button id="follower-button" onClick={() => followUser(profileUsername, username)}>Follow</button>
        ]}
        {/* { !isMyProfile && loggedIn && !followingUser &&
          <button id="follower-button" onClick={() => followUser(profileUsername, username)}>Follow</button>
        } */}
        <div id="dashboard-follower-buttons">
          <button onClick={() => setModal('follower')} id="follower-button">{numFollowers} followers</button>
          <button onClick={() => setModal('following')} id="follower-button">{numFollowing} following</button>
        </div>
      </div>
      
      { modal && 
        <Modal 
          title={modal} 
          setModal={setModal}
          profileUsername={profileUsername}
        />
      }

    </div>
  );
}

export default Dashboard;
