import React, { useEffect, useState } from 'react';
import FollowerUnit from 'components/dashboardComponents/FollowerUnit';

function FollowerList(props) { 

  const { array, forKey } = props;

  /* Create array of components */
  const list = [];
  for (let i=0; i<array.length; i++) {
    list.push(
      <FollowerUnit 
        username={array[i].username} 
        key={`${forKey}${i}`}
      />
    )
  };

  return (
    <>
      <div id="follower-list">{list}</div>
    </>
  );
}

export default FollowerList;
