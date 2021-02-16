import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'components/Modal'

function Dashboard(props) { 

  const { loggedIn, profileUsername, username } = props;
  const [followerArray, setFollowerArray] = useState([{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},{username: 'asdf'},]);
  const [followingArray, setFollowingArray] = useState([]);
  const [numFollowers, setNumFollowers] = useState('XXXX');
  const [numFollowing, setNumFollowing] = useState('XXXX');
  const [modal, setModal] = useState(false);

  /* Determine if page is YOUR profile or someone else's */
  const isMyProfile = (username === profileUsername) ? true : false;

  useEffect(async () => {

    /* Fetch the user's followers */
    await axios.post('/api/followers/getFollowers', { profileUsername })
      .then(res => {
        /* Push results to follower array (need to copy then set) */
        const newFollowerArray = followerArray;
        res.data.followers.forEach(follower => {
          newFollowerArray.push(follower);
        });
        setFollowerArray(newFollowerArray);
      })
      .catch(err => {
        if (err) console.log('something went wrong fetching followers', err);
      })

    /* Fetch who the user is following */
    await axios.post('/api/followers/getFollowing', { profileUsername })
    .then(res => {
      /* Push results to follower array (need to copy then set) */
      const newFollowingArray = followingArray;
      res.data.following.forEach(followee => {
        newFollowingArray.push(followee);
      });
      setFollowingArray(newFollowingArray);
    })
    .catch(err => {
      if (err) console.log('something went wrong fetching followings', err);
    })

    /* Fetch the number of followers and following */
    await axios.post('/api/followers/getNumFollowers', { profileUsername })
      .then(res => {
        setNumFollowers(res.data.numFollowers);
        setNumFollowing(res.data.numFollowing);
      })
      .catch(err => {
        if (err) console.log('something went wrong fetching followers', err);
      })

  }, []);

  /* FOLLOW USER */
  function followUser(profileUsername, username) {
    axios.post('/api/followers/followUser', { profileUsername, username })
      .then(res => {
        /* update the followers array */
        setFollowerArray(res.data.followers);
        /* also update the following number */
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
        /* update the followers array */
        setFollowerArray(res.data.followers);
        /* also update the following number */
        setNumFollowers(numFollowers-1);
      })
      .catch(err => {
        if (err) console.log('something went wrong fetching followers', err);
      })
  };

  /* Load the skeleton until the data has been fetched */
  return (
    <>
      <button onClick={() => setModal('follower')} id="follower-button">{numFollowers} followers</button>
      <button onClick={() => setModal('following')} id="follower-button">{numFollowing} following</button>
      
      { (modal==='follower') && 
        <Modal 
          title={modal} 
          array={followerArray}
          setModal={setModal}
        />
      }
      { (modal==='following') && 
        <Modal 
          title={modal} 
          array={followingArray}
          setModal={setModal}
        />
      }

      { isMyProfile &&
        <div>This is your profile and you are logged in</div>
      }

      { !isMyProfile && loggedIn && [
        <div>This is NOT your profile (but you are logged in)</div>,
        <button onClick={() => followUser(profileUsername, username)}>Follow {profileUsername}</button>,
        <button onClick={() => unfollowUser(profileUsername, username)}>Unfollow {profileUsername}</button>
      ]}

      { !loggedIn &&
        <div></div>
      }
    </>
  );
}

export default Dashboard;
