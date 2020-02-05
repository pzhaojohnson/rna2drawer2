function _removeNonDotBracketChars(dotBracket) {
  let result = '';

  for (let i = 0; i < dotBracket.length; i++) {
    let c = dotBracket.charAt(i);

    if (['(', ')', '[', ']', '{', '}', '<', '>', '.'].includes(c)) {
      result += c;
    }
  }

  return result;
}

/**
 * @typedef {object} ParsedDotBracket 
 * @property {Array<number|null>} allPartners The partners notation of all pairs in the structure.
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
 * @param {string} dotBracket The dot-bracket notation input by the user.
 * 
 * @returns {ParsedDotBracket} 
 * 
 * @throws {Error} If there are unmatched partners in the dot-bracket notation.
 */
function parseDotBracket(dotBracket) {
  dotBracket = _removeNonDotBracketChars(dotBracket);
  let secondaryPartners = [];
  let tertiaryPartners = [];

  for (let p = 1; p <= dotBracket.length; p++) {
    secondaryPartners.push(null);
    tertiaryPartners.push(null);
  }
  
  let up = { '(': [], '[': [], '{': [], '<': [] };
  
  function isUpChar(c) {
    return ['(', '[', '{', '<'].includes(c);
  }

  function isDownChar(c) {
    return [')', ']', '}', '>'].includes(c);
  }

  function isTertiaryChar(c) {
    return (isUpChar(c) && c !== '(') || (isDownChar(c) && c !== ')');
  }

  function addUp(upChar, pUp) {
    up[upChar].push(pUp);
  }

  function addPair(downChar, pDown) {
    let upChar = {
      ')': '(',
      ']': '[',
      '}': '{',
      '>': '<'
    }[downChar];

    if (up[upChar].length === 0) {
      throw new Error('Unmatched "' + downChar + '" downstream partner at position ' + pDown + '.');
    } else {
      let pUp = up[upChar].pop();
      let partners = isTertiaryChar(downChar) ? tertiaryPartners : secondaryPartners;
      partners[pUp - 1] = pDown;
      partners[pDown - 1] = pUp;
    }
  }

  for (let p = 1; p <= dotBracket.length; p++) {
    let c = dotBracket.charAt(p - 1);

    if (c === '.') {
      // nothing to do
    } else if (isUpChar(c)) {
      addUp(c, p);
    } else if (isDownChar(c)) {
      addPair(c, p);
    }
  }

  ['(', '[', '{', '<'].forEach(upChar => {
    if (up[upChar].length > 0) {
      let p = up[upChar].pop();
      throw new Error('Unmatched "' + upChar + '" upstream partner at position ' + p + '.');
    }
  });

  let allPartners = [...secondaryPartners];

  for (let p = 1; p <= tertiaryPartners.length; p++) {
    let q = tertiaryPartners[p - 1];

    if (q !== null) {
      allPartners[p - 1] = q;
      allPartners[q - 1] = p;
    }
  }

  return {
    allPartners: allPartners,
    secondaryPartners: secondaryPartners,
    tertiaryPartners: tertiaryPartners,
  };
}

export default parseDotBracket;
