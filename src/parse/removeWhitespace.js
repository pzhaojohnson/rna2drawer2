import isAllWhitespace from './isAllWhitespace';

/**
 * @param {string} s 
 * 
 * @returns {string} The given string with all whitespace characters removed.
 */
function removeWhitespace(s) {
  let noWhitespace = '';

  for (let i = 0; i < s.length; i++) {
    let c = s.charAt(i);

    if (!isAllWhitespace(c)) {
      noWhitespace += c;
    }
  }

  return noWhitespace;
}

export default removeWhitespace;
