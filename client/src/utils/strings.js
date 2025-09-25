import placeholders from '../start_phrases.json';
import { getRandomInt } from './math';

export function getTitle () {
  const random = getRandomInt(placeholders.search_anything.length);
  return placeholders.search_anything[random];
}
