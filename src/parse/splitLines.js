/**
 * @param {string} s 
 * 
 * @returns {Array<string>} 
 */
function splitLines(s) {
  return s.split(/\r\n|\r|\n/);
}

export {
  splitLines,
};
