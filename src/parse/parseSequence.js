let _defaultOptions = {
  toUpperCase: true,
  toLowerCase: false,

  t2u: true,
  u2t: false,

  ignoreNumbers: true,
  ignoreNonBases: true,
  ignoreNonAlphanumerics: true
};

/**
 * @param {object} options 
 * 
 * @returns {boolean} True if the options object is contradictory.
 */
function _contradictoryOptions(options) {
  return (options.toUpperCase && options.toLowerCase)
    || (options.t2u && u2t);
}

/**
 * @param {string} unparsed What the user input.
 * @param {object} options 
 * @param {boolean} options.toUpperCase True if letters are to be converted to upper case.
 * @param {boolean} options.toLowerCase True if letters are to be converted to lower case.
 * @param {boolean} options.t2u True if Ts (both lower and upper case) are to be converted to Us (of the same case).
 * @param {boolean} options.u2t True if Us (both lower and upper case) are to be converted to Ts (of the same case).
 * @param {boolean} options.ignoreNumbers True if numbers are to be ignored.
 * @param {boolean} options.ignoreNonBases True if letters that are not [A|a|U|u|G|g|C|c|T|t] are to be ignored.
 * @param {boolean} options.ignoreNonAlphanumerics True if characters that are not numbers or letters are to be ignored.
 * 
 * @returns {string} The parsed sequence.
 * 
 * @throws {Error} If contradictory options are given. Potentially contradictory options include
 *  toUpperCase and toLowerCase, and t2u and u2t.
 */
function parseSequence(unparsed, options=_defaultOptions) {
  let parsed = '';

  for (let i = 0; i < unparsed.length; i++) {
    let c = unparsed.charAt(i);


  }

  return parsed;
}

export default parseSequence;
