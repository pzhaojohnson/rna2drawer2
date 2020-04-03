import isAllWhitespace from './isAllWhitespace';

function _isNumber(c) {
  return c.match(/[0-9]/);
}

function _isLetter(c) {
  return c.match(/[A-Z|a-z]/)
}

function _isAUGCT(c) {
  return c.match(/[A|a|U|u|G|g|C|c|T|t]/);
}

function _isNonAlphanumeric(c) {
  return !_isNumber(c) && !_isLetter(c);
}

/**
 * Numbers are defined as [0-9].
 * Letters are defined as [A-Z|a-z].
 * AUGCT letters are defined as [A|a|U|u|G|g|C|c|T|t].
 * Non-alphanumeric characters are those that are not letters or numbers.
 * 
 * Whitespace characters are always ignored.
 * 
 * @param {string} unparsed What the user input.
 * @param {Object} options 
 * @param {boolean|undefined} [options.ignoreNumbers=undefined] 
 * @param {boolean|undefined} [options.ignoreNonAUGCTLetters=undefined] 
 * @param {boolean|undefined} [options.ignoreNonAlphanumerics=undefined] 
 * 
 * @returns {string} The parsed sequence.
 */
function parseSequence(unparsed, options={}) {
  let parsed = '';
  for (let i = 0; i < unparsed.length; i++) {
    let c = unparsed.charAt(i);
    let toBeIgnored = false;
    if (isAllWhitespace(c)) {
      toBeIgnored = true;
    } else if (_isNumber(c) && options.ignoreNumbers) {
      toBeIgnored = true;
    } else if (_isLetter(c) && !_isAUGCT(c) && options.ignoreNonAUGCTLetters) {
      toBeIgnored = true;
    } else if (_isNonAlphanumeric(c) && options.ignoreNonAlphanumerics) {
      toBeIgnored = true;
    }
    if (!toBeIgnored) {
      parsed += c;
    }
  }
  return parsed;
}

export default parseSequence;
