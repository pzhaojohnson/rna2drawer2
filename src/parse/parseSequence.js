import isAllWhitespace from './isAllWhitespace';

function _checkForContradictoryOptions(options) {
  if (options.toUpperCase && options.toLowerCase) {
    throw new Error('toUpperCase and toLowerCase options cannot both be true.');
  }

  if (options.t2u && options.u2t) {
    throw new Error('t2u and u2t options cannot both be true.');
  }
}

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
 * Whitespace characters are always ignored.
 * 
 * By default:
 *  The cases of letters are not changed.
 *  Neither Ts nor Us are converted to each other.
 *  Numbers are not ignored.
 *  Non-AUGCT letters are not ignored.
 *  Non-alphanumeric letters are not ignored.
 * 
 * @param {string} unparsed What the user input.
 * @param {object} options 
 * @param {boolean} options.toUpperCase True if letters are to be converted to upper case.
 * @param {boolean} options.toLowerCase True if letters are to be converted to lower case.
 * @param {boolean} options.t2u True if Ts (both lower and upper case) are to be converted to Us (of the same case).
 * @param {boolean} options.u2t True if Us (both lower and upper case) are to be converted to Ts (of the same case).
 * @param {boolean} options.ignoreNumbers True if numbers are to be ignored.
 * @param {boolean} options.ignoreNonAUGCTLetters True if letters that are not [A|a|U|u|G|g|C|c|T|t] are to be ignored.
 * @param {boolean} options.ignoreNonAlphanumerics True if characters that are not numbers or letters are to be ignored.
 * 
 * @returns {string} The parsed sequence.
 * 
 * @throws {Error} If options.toUpperCase and options.toLowerCase are both true.
 * @throws {Error} If options.t2u and options.u2t are both true.
 */
function parseSequence(unparsed, options={}) {
  _checkForContradictoryOptions(options);
  
  let parsed = '';

  for (let i = 0; i < unparsed.length; i++) {
    let c = unparsed.charAt(i);

    if (options.toUpperCase) {
      c = c.toUpperCase();
    } else if (options.toLowerCase) {
      c = c.toLowerCase();
    }

    if (options.t2u) {
      if (c === 'T') {
        c = 'U';
      } else if (c === 't') {
        c = 'u';
      }
    } else if (options.u2t) {
      if (c === 'U') {
        c = 'T';
      } else if (c === 'u') {
        c = 't';
      }
    }

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
