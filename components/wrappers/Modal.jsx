import React, { useEffect, useRef, useState } from 'react';
import ListenForOutsideClicks from 'components/wrappers/ListenForOutsideClicks';

export default function Card(props) {

  const { children, setModal } = props;

  return(
    <div className="modal-background">
      <ListenForOutsideClicks action={() => setModal(false)}>
        <div className="modal-container" >
          <button className="x-button x-button-modal" onClick={() => setModal(false)} >X</button>
          {children}
        </div>
      </ListenForOutsideClicks>
    </div>
  )
}