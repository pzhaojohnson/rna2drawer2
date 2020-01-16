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
 * Whitespace is always ignored.
 * 
 * Characters that are not [ '('|')' | '['|']' | '{'|'}' | '<'|'>' | '.' ] are always ignored.
 * 
 * Characters indicating tertiary pairings include [ '['|']' | '{'|'}' | '<'|'>' ].
 * 
 * @param {string} dotBracket The dot-bracket notation input by the user.
 * @param {boolean} [ignoreTertiaryPairings=false] True if positions represented by a tertiary
 *  pairing character are to be treated as unpaired.
 * 
 * @returns {Array<number|null>} The partners notation of the structure.
 * 
 * @throws {Error} If there are unmatched partners in the dot-bracket notation.
 */
function parseDotBracket(dotBracket, ignoreTertiaryPairings=false) {
  dotBracket = _removeNonDotBracketChars(dotBracket);
  let partners = [];

  for (let p = 1; p <= dotBracket.length; p++) {
    partners.push(null);
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
      partners[pUp - 1] = pDown;
      partners[pDown - 1] = pUp;
    }
  }

  for (let p = 1; p <= dotBracket.length; p++) {
    let c = dotBracket.charAt(p - 1);

    if (c === '.') {
      // nothing to do
    } else if (ignoreTertiaryPairings && isTertiaryChar(c)) {
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

  return partners;
}

export default parseDotBracket;
