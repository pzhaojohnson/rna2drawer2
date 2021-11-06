import { isBlank } from 'Parse/isBlank';

/**
 * Returns the given string with all whitespace characters removed.
 */
function removeWhitespace(s: string): string {
  let noWhitespace = '';

  for (let i = 0; i < s.length; i++) {
    let c = s.charAt(i);

    if (!isBlank(c)) {
      noWhitespace += c;
    }
  }

  return noWhitespace;
}

export default removeWhitespace;
