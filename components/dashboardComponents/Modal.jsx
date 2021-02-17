import React, { useEffect, useRef, useState } from 'react';
import FollowerList from 'components/dashboardComponents/FollowerList';

function Blank(props) { 

  const { title, setModal, profileUsername } = props;

  /*** Detect clicks outside the component ***/
  const ref = useRef(null);
  /* handles a click outside of the div with ref={ref} passed in */
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setModal(false);
    }
  };
  
  useEffect(() => {
    /* listen for clicks anywhere the dom */
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [])

  return (
    <div id="modal-background">
      <div id="follower-container" ref={ref}>
      <button className="x-button x-button-modal" onClick={() => setModal(false)} >X</button>
        {title === 'follower' && <div id="follower-title">Followers:</div>}
        {title === 'following' && <div id="follower-title">Following:</div>}
        <FollowerList 
          title={title}
          profileUsername={profileUsername}
        />
      </div>
    </div>
  );
}

export default Blank;
