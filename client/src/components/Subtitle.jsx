import { useState } from 'react';
import { getRandomInt } from '../utils/math';
import placeholders from '../start_phrases.json';

function getTitle () {
  const random = getRandomInt(placeholders.search_anything.length);
  return placeholders.search_anything[random];
}

function Subtitle() {
  const [title, setTitle] = useState(getTitle());

  const handleClick = () => {
    setTitle(getTitle);
  }
  
  return (
    <p className="subtitle" onClick={handleClick}>{title}!</p>
  );
}

export default Subtitle;