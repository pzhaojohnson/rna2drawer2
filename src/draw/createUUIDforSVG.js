const uuidv1 = require('uuid/v1');

/**
 * @returns {string} A universally unique ID that can be assigned to an SVG object.
 */
function createUUIDforSVG() {

  /*
  Must add a letter to the front of the ID, since SVG does not
  allow a number to be the first character of an ID.
  */
  return 'svg-' + uuidv1();
}

export default createUUIDforSVG;
