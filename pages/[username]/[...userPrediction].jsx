import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Index from 'pages/index';

/**
 * /username123/
 */

function UserPredictions(props) { 

  const router = useRouter()
  const { username: firstInSlug, userPrediction: secondInSlug } = router.query;

  return (
    <>
      <Index />
    </>
  );
}

export default UserPredictions;
 