import { useState, useRef } from 'react';

export default function FallingLink({ text = 'DEFAULT', href = '#' }) {
  const [running, setRunning] = useState(false);
  const [key, setKey] = useState(0);        // force re-render with same text
  const linkRef = useRef(null);

  const handleClick = (e) => {
    if (running) return;
    e.preventDefault();
    setRunning(true);

    setTimeout(() => {
      setRunning(false);   // reset animation state
      setKey(k => k + 1);  // re-mount spans so they appear “fresh”
      // then navigate
      if (linkRef.current) {
        const target = linkRef.current.target;
        const url = linkRef.current.href;
        if (target === '_blank') window.open(url, '_blank');
        else window.location.href = url;
      }
    }, text.length * 90 + 200);
  };

  const letters = text.split('').map((ch, i) => (
    <span
      key={`${key}-${i}`}
      className={running ? 'letter fall' : 'letter'}
      style={{ animationDelay: `${(text.length - 1 - i) * 90}ms` }}
    >
      {ch}
    </span>
  ));

  return (
    <a
      ref={linkRef}
      href={href}
      className="falling-link"
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
    >
      {letters}
    </a>
  );
}
