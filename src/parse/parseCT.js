import { splitLines } from './splitLines';
import isAllWhitespace from './isAllWhitespace';
import { nonemptySplitByWhitespace } from './nonemptySplitByWhitespace';
import { partnersAreValid } from './partnersAreValid';

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
    return items[0].charAt(0) === '#';
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
 * Returns null if the letter cannot be parsed.
 * 
 * @param {string} bodyLine 
 * 
 * @returns {string|null} 
 */
function _letter(bodyLine) {
  let items = nonemptySplitByWhitespace(bodyLine);
  if (items.length < 2) {
    return null;
  } else {
    let letter = items[1];
    if (letter.length !== 1) {
      return null;
    } else {
      return letter;
    }
  }
}

/**
 * Returns null if:
 *  The partner is not specified.
 *  The partner is not a number.
 *  The partner is not an integer.
 *  The partner is zero.
 * 
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
    } else if (q === 0) {
      return null;
    } else {
      return q;
    }
  }
}

/**
 * Returns zero if:
 *  The position or offset position not specified.
 *  The position or offset position are not numbers.
 *  The position or offset position are not integers.
 * 
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
 * Returns null if the sequence cannot be parsed.
 * 
 * @param {string} ct 
 * 
 * @returns {string|null} 
 */
function _parseSequence(ct) {
  let lines = splitLines(ct);
  let i = _headerLineIndex(lines);
  if (i === null) {
    return null;
  } else {
    let sequence = '';
    let j = i + 1;
    while (j < lines.length && !_lineShouldBeIgnored(lines[j])) {
      let letter = _letter(lines[j]);
      if (letter === null) {
        return null;
      } else {
        sequence += letter;
      }
      j++;
    }
    return sequence;
  }
}

/**
 * Returns null if the structure cannot be parsed.
 * 
 * @param {string} ct 
 * 
 * @returns {Array<number|null>|null} 
 */
function _parsePartners(ct) {
  let lines = splitLines(ct);
  let i = _headerLineIndex(lines);
  if (i === null) {
    return null;
  } else {
    let partners = [];
    let j = i + 1;
    while (j < lines.length && !_lineShouldBeIgnored(lines[j])) {
      partners.push(_partner(lines[j]));
      j++;
    }
    return partners;
  }
}

/**
 * Returns zero if the numbering offset cannot be parsed.
 * 
 * @param {string} ct 
 * 
 * @returns {number} 
 */
function _parseNumberingOffset(ct) {
  let lines = splitLines(ct);
  let i = _headerLineIndex(lines);
  if (i === null) {
    return 0;
  } else {
    let j = i + 1;
    if (j === lines.length) {
      return 0;
    } else {
      return _numberingOffset(lines[j]);
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
 * Returns null if:
 *  The sequence or structure cannot be parsed.
 *  The parsed structure is invalid.
 *  The parsed sequence or structure are different lengths.
 * 
 * @param {string} ct 
 * 
 * @returns {ParsedCT|null} 
 */
function parseCT(ct) {
  let sequence = _parseSequence(ct);
  let partners = _parsePartners(ct);
  let numberingOffset = _parseNumberingOffset(ct);
  if (sequence === null || partners === null) {
    return null;
  } else if (!partnersAreValid(partners)) {
    return null;
  } else if (sequence.length !== partners.length) {
    return null;
  } else {
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

  // these are only exported to aid testing
  _lineShouldBeIgnored,
  _headerLineIndex,
  _numSequences,
  _letter,
  _partner,
  _numberingOffset,
  _parseSequence,
  _parsePartners,
  _parseNumberingOffset,
};
