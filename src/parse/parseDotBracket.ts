const _TERTIARY_UPS = ['[', '{', '<'];
const _TERTIARY_DOWNS = [']', '}', '>'];

function _isDotBracketChar(c: string): boolean {
  return c === '.'
    || c === '('
    || c === ')'
    || _TERTIARY_UPS.includes(c)
    || _TERTIARY_DOWNS.includes(c);
}

function _removeNonDotBracketChars(dotBracket: string): string {
  let filtered = '';
  for (let i = 0; i < dotBracket.length; i++) {
    let c = dotBracket.charAt(i);
    if (_isDotBracketChar(c)) {
      filtered += c;
    }
  }
  return filtered;
}

function _isUpChar(c: string): boolean {
  return c === '(' || _TERTIARY_UPS.includes(c);
}

function _isDownChar(c: string): boolean {
  return c === ')' || _TERTIARY_DOWNS.includes(c);
}

function _isTertiaryChar(c: string): boolean {
  return (_isUpChar(c) && c !== '(') || (_isDownChar(c) && c !== ')');
}

function _correspondingUpChar(downChar: string): (string | undefined) {
  return ({
    ')': '(',
    ']': '[',
    '}': '{',
    '>': '<',
  } as { [c: string]: string })[downChar];
}

interface TraversedDotBracket {
  secondaryPartners: (number | null)[];
  tertiaryPartners: (number | null)[];
  lastUnmatchedUpPartner: string | null;
  lastUnmatchedDownPartner: string | null;
}

function _traverseDotBracket(dotBracket: string): TraversedDotBracket {
  dotBracket = _removeNonDotBracketChars(dotBracket);
  
  let secondaryPartners = [];
  let tertiaryPartners = [];
  for (let p = 1; p <= dotBracket.length; p++) {
    secondaryPartners.push(null);
    tertiaryPartners.push(null);
  }
  let lastUnmatchedUpPartner = null;
  let lastUnmatchedDownPartner = null;

  let ups = { '(': [], '[': [], '{': [], '<': [] } as { [c: string]: number[] };
  
  for (let p = 1; p <= dotBracket.length; p++) {
    let c = dotBracket.charAt(p - 1);

    if (_isUpChar(c)) {
      ups[c].push(p);
    } else if (_isDownChar(c)) {
      let upChar = _correspondingUpChar(c) as string;
      
      if (ups[upChar].length === 0) {
        lastUnmatchedDownPartner = c;
      } else {
        let pUp = ups[upChar].pop() as number;
        
        if (_isTertiaryChar(c)) {
          tertiaryPartners[pUp - 1] = p;
          tertiaryPartners[p - 1] = pUp;
        } else {
          secondaryPartners[pUp - 1] = p;
          secondaryPartners[p - 1] = pUp;
        }
      }
    }
  }

  ['(', '[', '{', '<'].forEach(upChar => {
    if (ups[upChar].length > 0) {
      lastUnmatchedUpPartner = upChar;
    }
  });
  
  return {
    secondaryPartners: secondaryPartners,
    tertiaryPartners: tertiaryPartners,
    lastUnmatchedUpPartner: lastUnmatchedUpPartner,
    lastUnmatchedDownPartner: lastUnmatchedDownPartner,
  };
}

export interface ParsedDotBracket {
  secondaryPartners: (number | null)[];
  tertiaryPartners: (number | null)[];
}

/**
 * Whitespace is always ignored.
 * 
 * Characters that are not [ '('|')' | '['|']' | '{'|'}' | '<'|'>' | '.' ] are always ignored.
 * 
 * Characters indicating tertiary pairs include [ '['|']' | '{'|'}' | '<'|'>' ].
 * 
 * Returns null if the dot-bracket notation is invalid.
 */
function parseDotBracket(dotBracket: string): (ParsedDotBracket | null) {
  if (hasUnmatchedUpPartner(dotBracket) || hasUnmatchedDownPartner(dotBracket)) {
    return null;
  } else {
    let traversed = _traverseDotBracket(dotBracket);
    return {
      secondaryPartners: traversed.secondaryPartners,
      tertiaryPartners: traversed.tertiaryPartners,
    };
  }
}

function hasUnmatchedUpPartner(dotBracket: string): boolean {
  let traversed = _traverseDotBracket(dotBracket);
  return traversed.lastUnmatchedUpPartner !== null;
}

/**
 * Returns null if there are no unmatched upstream partners.
 */
function lastUnmatchedUpPartner(dotBracket: string): (string | null) {
  let traversed = _traverseDotBracket(dotBracket);
  return traversed.lastUnmatchedUpPartner;
}

function hasUnmatchedDownPartner(dotBracket: string): boolean {
  let traversed = _traverseDotBracket(dotBracket);
  return traversed.lastUnmatchedDownPartner !== null;
}

/**
 * Returns null if there are no unmatched downstream partners.
 */
function lastUnmatchedDownPartner(dotBracket: string): (string | null) {
  let traversed = _traverseDotBracket(dotBracket);
  return traversed.lastUnmatchedDownPartner;
}

export default parseDotBracket;

export {
  parseDotBracket,
  hasUnmatchedUpPartner,
  lastUnmatchedUpPartner,
  hasUnmatchedDownPartner,
  lastUnmatchedDownPartner,

  // these are only exported to aid testing
  _isDotBracketChar,
  _removeNonDotBracketChars,
  _isUpChar,
  _isDownChar,
  _isTertiaryChar,
  _correspondingUpChar,
  _traverseDotBracket,
};
