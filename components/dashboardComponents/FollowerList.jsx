import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FollowerUnit from 'components/dashboardComponents/FollowerUnit';

function FollowerList(props) { 

  // title is either 'follower' or 'following'
  const { title, profileUsername } = props;

  const [array, setArray] = useState([]);
  const [skeleton, setSkeleton] = useState(true);

  useEffect(async() => {
    
    if (title === 'follower') {
      /* Fetch the user's followers */
      await axios.post('/api/followers/getFollowers', { profileUsername })
      .then(res => {
        /* Push results to follower array (need to copy then set) */
        const newArray = array;
        res.data.followers.forEach(follower => {
          newArray.push(follower);
        });
        setArray(newArray);
        setSkeleton(false);
      })
      .catch(err => {
        if (err) console.log('something went wrong fetching followers', err);
      })
    };

    if (title === 'following') {
      /* Fetch who the user is following */
      await axios.post('/api/followers/getFollowing', { profileUsername })
        .then(res => {
          /* Push results to follower array (need to copy then set) */
          const newArray = array;
          res.data.following.forEach(followee => {
            newArray.push(followee);
          });
          setArray(newArray);
          setSkeleton(false);
        })
        .catch(err => {
          if (err) console.log('something went wrong fetching followings', err);
        })
    };
  }, [])

  return (
    <>
      {skeleton && <div id="follower-list"></div>}
      {!skeleton && <div id="follower-list">
        {array.map((el, i) => 
          <FollowerUnit 
            username={el.username} 
            image={el.image}
            key={`${title}${i}`}
          />
        )}
      </div>
      }
    </>
  );
}

export default FollowerList;
