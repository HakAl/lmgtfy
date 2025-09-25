import React, { useState } from 'react';

export default function FallingLink({text = ''}) {
  const [running, setRunning] = useState(false);

  const handleClick = e => {
    e.preventDefault();
    if (running) return;
    setRunning(true);
  };

  const letters = text.split('').map((ch, i) => (
    <span
      key={i}
      className={running ? 'letter fall' : 'letter'}
      style={{
        animationDelay: `${(text.length - 1 - i) * 90}ms`
      }}
    >
      {ch}
    </span>
  ));

  return (
    <a href="/terms" className="falling-link" onClick={handleClick}>
      {letters}
    </a>
  );
}