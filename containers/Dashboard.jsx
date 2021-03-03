import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FollowerList from 'components/dashboardComponents/FollowerList';
import DragAndDrop from 'components/wrappers/DragAndDrop';
import Modal from 'components/wrappers/Modal';
import FileDrop from 'components/wrappers/FileDrop';

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

  function handleDrop(f) {
    alert('fuck')
  };

  async function handleProfileImageUpload(e) {
    const file = e.target.files[0];

    console.log('file',file)

    await fetch('/api/image/profileUpload', { 
      method: 'PUT',
      body: { file },
      'Content-Type': 'image/jpg',
    })
    .then(res => res.json())
    .then(res => {
      const url = res.location;
      console.log('final:', url);

      
      const urlToFile = (url, filename) => {
        return fetch(url, {
          mode: 'no-cors'
        })
          .then((res) => {
            return res.arrayBuffer();
          })
          .then((buf) => {
            return new File([buf], filename);
          });
      };

      urlToFile(url, 'image-upload')
        .then(data => console.log('data',data))
        .then(data => {
          // const newurl = URL.createObjectURL(data);
          setFile(data)
        })    

      // })

      // .then(res => res.json())
      // .then(res => {
      //   console.log('res',res.data)
      // })
      // .then(res => {
      //   // See if I can convert the result into a URL and such
      //   console.log('resULT', res)
      //   const url = res.Location;
      //   const urlToFile = (url, filename) => {
      //     return fetch(url)
      //       .then((res) => {
      //         return res.arrayBuffer();
      //       })
      //       .then((buf) => {
      //         return new File([buf], filename);
      //       });
      //   };
      //   urlToFile(url, 'asdfasdf')
      //     .then(data => console.log('data',data))
      //     .then(data => {
      //       const newurl = URL.createObjectURL(data);
      //       console.log('newurl', newurl)
      //       setFile(newurl)
      //     })
      // .catch(err => {
      //   console.log('err uploading profile image', err.response);
      // })
    })
  };
  

  /* Load the skeleton until the data has been fetched */
  return (
    <div id="dashboard-content">

      {/* <DragAndDrop handleDrop={handleDrop}>
        <img src={profileImage} alt="" className="profile-image-lg dashboard-profile-image" />
      </DragAndDrop> */}
{/* 
      <p>Filename: {file.name}</p>
      <p>File type: {file.type}</p>
      <p>File size: {file.size} bytes</p> */}
      {file && <img src={URL.createObjectURL(file)} />}

      {/* <img src={file} /> */}
      file: {file}

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
