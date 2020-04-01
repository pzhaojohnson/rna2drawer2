import { splitLines } from './splitLines';
import isAllWhitespace from './isAllWhitespace';
import { nonemptySplitByWhitespace } from './nonemptySplitByWhitespace';
import validatePartners from './validatePartners';

/**
 * @param {string} line 
 * 
 * @returns {boolean} 
 */
function _lineShouldBeIgnored(line) {
  if (isAllWhitespace(line)) {
    return true;
  } else {
    let items = nonemptySplitByWhitespace(line);
    return items[0][0] === '#';
  }
}

/**
 * Returns null if a header line cannot be found.
 * 
 * @param {Array<string>} lines 
 * 
 * @returns {number|null} 
 */
function _headerLineIndex(lines) {
  let i = 0;
  while (i < lines.length && _lineShouldBeIgnored(lines[i])) {
    i++;
  }
  if (i === lines.length) {
    return null;
  } else {
    return i;
  }
}

/**
 * This will always return at least one.
 * 
 * @param {string} headerLine 
 * 
 * @returns {number} 
 */
function _numSequences(headerLine) {
  let items = nonemptySplitByWhitespace(headerLine);
  if (items.length < 2) {
    return 1;
  } else {
    let num = Number(items[1]);
    if (num === NaN) {
      return 1;
    } else if (!Number.isInteger(num)) {
      return 1;
    } else {
      return Math.max(num, 1);
    }
  }
}

/**
 * @param {string} bodyLine 
 * 
 * @returns {string} 
 * 
 * @throws {Error} If the letter cannot be parsed.
 */
function _letter(bodyLine) {
  let items = nonemptySplitByWhitespace(bodyLine);
  if (items.length < 2) {
    throw new Error('Letter cannot be parsed.');
  } else {
    let letter = items[1];
    if (letter.length !== 1) {
      throw new Error('Letter cannot be parsed.');
    } else {
      return letter;
    }
  }
}

/**
 * @param {string} bodyLine 
 * 
 * @returns {number|null} 
 */
function _partner(bodyLine) {
  let items = nonemptySplitByWhitespace(bodyLine);
  if (items.length < 5) {
    return null;
  } else {
    let q = Number(items[4]);
    if (q === NaN) {
      return null;
    } else if (!Number.isInteger(q)) {
      return null;
    } else {
      return q;
    }
  }
}

/**
 * @param {string} bodyLine 
 * 
 * @returns {number} 
 */
function _numberingOffset() {
  let items = nonemptySplitByWhitespace(bodyLine);
  if (items.length < 6) {
    return 0;
  } else {
    let p = Number(items[0]);
    let op = Number(items[5]);
    if (p === NaN || op === NaN) {
      return 0;
    } else if (!Number.isInteger(p) || !Number.isInteger(op)) {
      return 0;
    } else {
      return op - p;
    }
  }
}

/**
 * @typedef {Object} ParsedCT 
 * @property {string} sequence 
 * @property {Array<number|null>} partners 
 * @property {number} numberingOffset 
 */

/**
 * @param {string} ct 
 * 
 * @returns {ParsedCT} 
 * 
 * @throws {Error} If a structure cannot be found.
 * @throws {Error} If a letter cannot be parsed.
 * @throws {Error} If the specified structure is invalid.
 */
function parseCT(ct) {
  let lines = splitLines(ct);
  let i = _headerLineIndex(lines);
  if (i === null) {
    throw new Error('No structure found.');
  } else {
    let partners = [];
    let numberingOffset = 0;
    let j = i + 1;
    while (j < lines.length && !_lineShouldBeIgnored(lines[j])) {
      let lj = lines[j];
      sequence += _letter(lj);
      partners.push(_partner(lj));
      numberingOffset = _numberingOffset(lj);
      j++;
    }
    validatePartners(partners);
    return {
      sequence: sequence,
      partners: partners,
      numberingOffset: numberingOffset,
    };
  }
}

/**
 * @param {string} ct 
 * 
 * @returns {number} 
 */
function numSequencesInCT(ct) {
  let lines = splitLines(ct);
  let i = _headerLineIndex(lines);
  if (i === null) {
    return 0;
  } else {
    return _numSequences(lines[i]);
  }
}

export {
  parseCT,
  numSequencesInCT,
};
