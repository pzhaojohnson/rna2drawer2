import stemOfPosition from './stemOfPosition';

/**
 * @param {number} p 
 * @param {Array<number|null>} partners 
 * 
 * @returns {boolean} 
 */
function positionIsInStem(p, partners) {
  if (stemOfPosition(p, partners)) {
    return true;
  }
  return false;
}

export default positionIsInStem;
