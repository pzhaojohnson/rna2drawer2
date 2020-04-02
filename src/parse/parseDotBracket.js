const _TERTIARY_UPS = ['[', '{', '<'];
const _TERTIARY_DOWNS = [']', '}', '>'];

/**
 * @param {string} c 
 * 
 * @returns {boolean} 
 */
function _isDotBracketChar(c) {
  return c === '.'
    || c === '('
    || c === ')'
    || _TERTIARY_UPS.includes(c)
    || _TERTIARY_DOWNS.includes(c);
}

/**
 * @param {string} dotBracket 
 * 
 * @returns {string} 
 */
function _removeNonDotBracketChars(dotBracket) {
  let filtered = '';
  for (let i = 0; i < dotBracket.length; i++) {
    let c = dotBracket.charAt(i);
    if (_isDotBracketChar(c)) {
      filtered += c;
    }
  }
  return filtered;
}

/**
 * @param {string} c 
 * 
 * @returns {boolean} 
 */
function _isUpChar(c) {
  return c === '(' || _TERTIARY_UPS.includes(c);
}

/**
 * @param {string} c 
 * 
 * @returns {boolean} 
 */
function _isDownChar(c) {
  return c === ')' || _TERTIARY_DOWNS.includes(c);
}

/**
 * @param {string} c 
 * 
 * @returns {boolean} 
 */
function _isTertiaryChar(c) {
  return (_isUpChar(c) && c !== '(') || (_isDownChar(c) && c !== ')');
}

/**
 * @param {string} downChar 
 * 
 * @returns {string} 
 */
function _correspondingUpChar(downChar) {
  return {
    ')': '(',
    ']': '[',
    '}': '{',
    '>': '<',
  }[downChar];
}

/**
 * @typedef {Object} TraversedDotBracket 
 * @property {Array<number|null>} secondaryPartners 
 * @property {Array<number|null>} tertiaryPartners 
 * @property {boolean} unmatchedUpstreamPartner True if there is an unmatched upstream partner.
 * @property {boolean} unmatchedDownstreamPartner True if there is an unmatched downstream partner.
 */

function _traverseDotBracket(dotBracket) {
  dotBracket = _removeNonDotBracketChars(dotBracket);
  let secondaryPartners = [];
  let tertiaryPartners = [];
  for (let p = 1; p <= dotBracket.length; p++) {
    secondaryPartners.push(null);
    tertiaryPartners.push(null);
  }
  let unmatchedUpstreamPartner = false;
  let unmatchedDownstreamPartner = false;

  let ups = { '(': [], '[': [], '{': [], '<': [] };
  
  for (let p = 1; p <= dotBracket.length; p++) {
    let c = dotBracket.charAt(p - 1);
    if (_isUpChar(c)) {
      ups[c].push(p);
    } else if (_isDownChar(c)) {
      let upChar = _correspondingUpChar(c);
      if (ups[upChar].length === 0) {
        unmatchedDownstreamPartner = true;
      } else {
        let pUp = ups[upChar].pop();
        let partners = _isTertiaryChar(c) ? tertiaryPartners : secondaryPartners;
        partners[pUp - 1] = p;
        partners[p - 1] = pUp;
      }
    }
  }

  ['(', '[', '{', '<'].forEach(upChar => {
    if (ups[upChar].length > 0) {
      unmatchedUpstreamPartner = true;
    }
  });
  
  return {
    secondaryPartners: secondaryPartners,
    tertiaryPartners: tertiaryPartners,
    unmatchedUpstreamPartner: unmatchedUpstreamPartner,
    unmatchedDownstreamPartner: unmatchedDownstreamPartner,
  };
}

/**
 * @typedef {object} ParsedDotBracket 
 * @property {Array<number|null>} secondaryPartners The partners notation of the secondary structure.
 * @property {Array<number|null>} tertiaryPartners The partners notation of the tertiary structure.
 */

/**
 * Whitespace is always ignored.
 * 
 * Characters that are not [ '('|')' | '['|']' | '{'|'}' | '<'|'>' | '.' ] are always ignored.
 * 
 * Characters indicating tertiary pairs include [ '['|']' | '{'|'}' | '<'|'>' ].
 * 
 * Returns null if the dot-bracket notation is invalid.
 * 
 * @param {string} dotBracket The dot-bracket notation input by the user.
 * 
 * @returns {ParsedDotBracket|null} 
 */
function parseDotBracket(dotBracket) {
  let traversed = _traverseDotBracket(dotBracket);
  if (traversed.unmatchedUpstreamPartner || traversed.unmatchedDownstreamPartner) {
    return null;
  } else {
    return {
      secondaryPartners: traversed.secondaryPartners,
      tertiaryPartners: traversed.tertiaryPartners,
    };
  }
}

export default parseDotBracket;
