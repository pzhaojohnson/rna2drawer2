/**
 * @param {string} fileName 
 * 
 * @returns {string} 
 */
function parseFileExtension(fileName) {
  return fileName.split('.').pop();
}

export default parseFileExtension;
