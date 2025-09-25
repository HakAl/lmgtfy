import React, { useState } from 'react';

function AnimatedTitle({ title }) {
  const [isRunning, setIsRunning] = useState(false);

  const handleClick = () => {
    setIsRunning(false);
    requestAnimationFrame(() => setIsRunning(true));
  };

  return (
    <h1 className={`animated-title ${isRunning ? 'is-running' : ''}`} onClick={handleClick}>
      <span>{title}</span>
    </h1>
  );
}

export default AnimatedTitle;