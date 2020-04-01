import { splitLines } from './splitLines';
import isAllWhitespace from './isAllWhitespace';
import { nonemptySplitByWhitespace } from './nonemptySplitByWhitespace';

/**
 * @param {Array<string>} lines 
 * 
 * @returns {number} 
 */
function _startingLine(lines) {}

/**
 * Returns null when the number of sequences cannot be determined.
 * 
 * @param {string} startingLine 
 * 
 * @returns {number|null} 
 */
function _numSequences(startingLine) {}

function _position() {}

function _partner() {}

function _numberingOffset() {}

/**
 * @typedef {Object} ParsedCT 
 * @property {Array<number|null>} partners The partners notation of the structure.
 * @property {number} numberingOffset 
 */

/**
 * @param {string} ct 
 * 
 * @returns {ParsedCT} 
 */
function parseCT(ct) {}

export {
  parseCT,
};
