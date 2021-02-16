import React, { useEffect, useState } from 'react';

function FollowerUnit(props) { 

  const { username } = props;

  const link = `/${username}`;

  // the follow button can also go next to their name

  return (
    <>
      <div id="follower-unit" loading="lazy" ><a href={link}>{username}</a></div>
    </>
  );
}

export default FollowerUnit;
