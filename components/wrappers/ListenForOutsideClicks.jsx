import React, { useEffect, useRef } from 'react';

export default function Card({children, action}) {

  /*** Detect clicks outside the component ***/
  const ref = useRef(null);
  /* handles a click outside of the div with ref={ref} passed in */
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      action();
    }
  };
  
  useEffect(() => {
    /* listen for clicks anywhere the dom */
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [])
  
  return(
      <div ref={ref}>
        {children}
      </div>
  )
}