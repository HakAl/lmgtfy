import React, { useState } from 'react';
import robot from '/robot_32.svg';

function BouncingSvg() {
  const [isBouncing, setIsBouncing] = useState(false);

  const handleClick = () => {
    setIsBouncing(false);
    requestAnimationFrame(() => setIsBouncing(true));
  };

  return (
    <img
      className={`icon bounce-svg ${isBouncing ? 'is-bouncing' : ''}`}
      src={robot}
      onClick={handleClick}
      alt="robot"
    />
  );
}

export default BouncingSvg;