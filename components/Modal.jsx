import React, { useEffect, useState } from 'react';
import FollowerList from 'components/dashboardComponents/FollowerList';

function Blank(props) { 

  const { array, title, setModal } = props;

  return (
    <div id="modal-background">
      <div id="follower-container">
      <button className="x-button x-button-modal" onClick={() => setModal(false)} >X</button>
        <div id="follower-title">{title}: </div>
        <FollowerList 
          array={array}
          forKey={title}
        />
      </div>
    </div>
  );
}

export default Blank;
