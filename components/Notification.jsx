import React, { useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion"

export default function Card(props) {

  const { children, setNotification } = props;

  return(
    <>
      <motion.div id="notification" 
        animate={{ opacity: 1 }} 
        initial={{ opacity: 0 }}
        transition={{ delay: 0, duration: 0.5 }}
      >
        {children}
        <button id="notif-x-button" onClick={() => setNotification(false)}>X</button>
      </motion.div>
    </>
  );
}