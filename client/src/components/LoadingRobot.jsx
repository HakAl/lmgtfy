import { useState, useEffect } from 'react';
import robot from '/robot_32.svg';

export default function LoadingRobot({ isLoading }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!isLoading) return;
    setText("");
    const phrase = "Let me get that for you...";
    let i = 0;
    const t = setInterval(() => {
      setText(phrase.slice(0, i + 1));
      i++;
      if (i >= phrase.length) clearInterval(t);
    }, 120);
    return () => clearInterval(t);
  }, [isLoading]);

  return (
    <div className="loading-box">
      <img
        src={robot}
        alt="droid"
        className={`center-logo ${isLoading ? "jiggle" : ""}`}
      />
      <p className="loading-text">{text}</p>
    </div>
  );
}