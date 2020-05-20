import unpairedRegionOfPosition from './unpairedRegionOfPosition';

/**
 * @param {number} p 
 * @param {Array<number|null>} partners 
 * 
 * @returns {boolean} 
 */
function positionIsInUnpairedRegion(p, partners) {
  if (unpairedRegionOfPosition(p, partners)) {
    return true;
  }
  return false;
}

export default positionIsInUnpairedRegion;
