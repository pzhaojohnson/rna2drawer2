import { splitLines } from './splitLines';
import isAllWhitespace from './isAllWhitespace';
import { nonemptySplitByWhitespace } from './nonemptySplitByWhitespace';
import { areValid as partnersAreValid } from 'Partners/areValid';

function _lineShouldBeIgnored(line: string): boolean {
  if (isAllWhitespace(line)) {
    return true;
  } else {
    let items = nonemptySplitByWhitespace(line);
    return items[0].charAt(0) === '#';
  }
}

/**
 * Returns null if a header line cannot be found.
 */
function _headerLineIndex(lines: string[]): (number | null) {
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
 * Returns null if the letter cannot be parsed.
 */
function _letter(bodyLine: string): (string | null) {
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
 * Returns null if the sequence cannot be parsed.
 */
function _parseSequence(ct: string): (string | null) {
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
 * Returns null if:
 *  The partner is not specified.
 *  The partner is not a number.
 *  The partner is not an integer.
 *  The partner is zero.
 */
function _partner(bodyLine: string): (number | null) {
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
 * Returns null if:
 *  The structure cannot be parsed.
 *  The parsed structure is invalid.
 */
function _parsePartners(ct: string): ((number | null)[] | null) {
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
    if (partnersAreValid(partners)) {
      return partners;
    } else {
      return null;
    }
  }
}

/**
 * Returns zero if:
 *  The position or offset position not specified.
 *  The position or offset position are not numbers.
 *  The position or offset position are not integers.
 */
function _numberingOffset(bodyLine: string): number {
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
 * Returns zero if the numbering offset cannot be parsed.
 */
function _parseNumberingOffset(ct: string): number {
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

export interface ParsedCt {
  sequence: string;
  partners: (number | null)[];
  numberingOffset: number;
}

/**
 * Returns null if:
 *  There are zero or multiple sequences.
 *  The sequence or structure cannot be parsed.
 *  The parsed structure is invalid.
 *  The parsed sequence or structure are different lengths.
 */
function parseCt(ct: string): (ParsedCt | null) {
  if(numSequencesInCT(ct) !== 1) {
    return null;
  }
  let sequence = _parseSequence(ct);
  let partners = _parsePartners(ct);
  let numberingOffset = _parseNumberingOffset(ct);
  if (sequence === null || partners === null) {
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
 * This will always return at least one.
 */
function _numSequences(headerLine: string): number {
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

function numSequencesInCT(ct: string): number {
  let lines = splitLines(ct);
  let i = _headerLineIndex(lines);
  if (i === null) {
    return 0;
  } else {
    return _numSequences(lines[i]);
  }
}

export {
  parseCt,
  numSequencesInCT,

  // these are only exported to aid testing
  _lineShouldBeIgnored,
  _headerLineIndex,
  _letter,
  _partner,
  _numberingOffset,
  _parseSequence,
  _parsePartners,
  _parseNumberingOffset,
  _numSequences,
};
