import { isBlank } from 'Parse/isBlank';

function _isNumber(c: string) {
  return c.match(/[0-9]/);
}

function _isLetter(c: string) {
  return c.match(/[A-Z]|[a-z]/)
}

function _isAUGCT(c: string) {
  return c.match(/A|a|U|u|G|g|C|c|T|t/);
}

function _isNonAlphanumeric(c: string) {
  return !_isNumber(c) && !_isLetter(c);
}

interface Options {
  ignoreNumbers?: boolean;
  ignoreNonAUGCTLetters?: boolean;
  ignoreNonAlphanumerics?: boolean;
}

/**
 * Numbers are defined as [0-9].
 * Letters are defined as [A-Z|a-z].
 * AUGCT letters are defined as [A|a|U|u|G|g|C|c|T|t].
 * Non-alphanumeric characters are those that are not letters or numbers.
 *
 * Whitespace characters are always ignored.
 */
function parseSequence(unparsed: string, options=({} as Options)): string {
  let parsed = '';
  for (let i = 0; i < unparsed.length; i++) {
    let c = unparsed.charAt(i);
    let toBeIgnored = false;
    if (isBlank(c)) {
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

export {
  parseSequence,

  // these are only exported to aid testing
  _isNumber,
  _isLetter,
  _isAUGCT,
  _isNonAlphanumeric,
};
