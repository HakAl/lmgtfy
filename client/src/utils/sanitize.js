export function sanitizeSearchInput(str) {
  return str
    .replace(/[<>"'&]/g, '')        // drop < > " ' & completely
    .replace(/[^\p{L}\p{N}\s\-_.@!?]/gu, ' ') // keep letters, numbers, space, - _ . @ ! ?
    .replace(/\s{2,}/g, ' ')         // collapse multiple spaces
    .trim();
}