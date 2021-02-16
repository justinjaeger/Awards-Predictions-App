import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'components/Modal'

function Dashboard(props) { 

  const { loggedIn, profileUsername, username } = props;
  const [numFollowers, setNumFollowers] = useState('');
  const [numFollowing, setNumFollowing] = useState('');
  const [followingUser, setFollowingUser] = useState(false);
  const [modal, setModal] = useState(false);

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

    /* Determine if we are following them */
    if (loggedIn) {
      await axios.post('/api/followers/determineFollowing', { username, profileUsername })
        .then(res => {
          setFollowingUser(res.data.followingUser)
        })
        .catch(err => {
          if (err) console.log('something went wrong fetching followers', err);
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
    <>

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

      <button onClick={() => setModal('follower')} id="follower-button">{numFollowers} followers</button>
      <button onClick={() => setModal('following')} id="follower-button">{numFollowing} following</button>
      
      { modal && 
        <Modal 
          title={modal} 
          setModal={setModal}
          profileUsername={profileUsername}
        />
      }
    </>
  );
}

export default Dashboard;
