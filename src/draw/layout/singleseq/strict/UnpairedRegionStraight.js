import VirtualBaseCoordinates from '../../VirtualBaseCoordinates';

/**
 * @param {UnpairedRegion} ur 
 * @param {Array<StrictLayoutBaseProps>} baseProps 
 * 
 * @returns {number} The sum of the positive 3' stretches that contribute to the length
 *  of the given unpaired region.
 */
function _positiveStretch(ur, baseProps) {
  let ps = 0;

  for (let p = ur.boundingPosition5; p < ur.boundingPosition3; p++) {

    // in case the 5' bounding position is zero
    if (p > 0) {
      ps += Math.max(0.0001, baseProps[p - 1].stretch3);
    }
  }

  return ps;
}

/**
 * @param {UnpairedRegion} ur 
 * @param {Array<StrictLayoutBaseProps>} baseProps 
 * 
 * @returns {Array<VirtualBaseCoordinates>} 
 */
function baseCoordinatesStraight(ur, baseProps) {
  let coordinates = [];
  let bcb5 = ur.baseCoordinatesBounding5();
  let bcb3 = ur.baseCoordinatesBounding3();
  
  let totalDistance = bcb5.distanceBetweenCenters(bcb3);
  let excessDistance = totalDistance - (ur.size + 1);
  excessDistance = Math.max(excessDistance, 0);
  
  let positiveStretch = _positiveStretch(ur, baseProps);
  
  let x = bcb5.xLeft;
  let y = bcb5.yTop;
  let angle = bcb5.angleBetweenCenters(bcb3);

  for (let p = ur.boundingPosition5 + 1; p < ur.boundingPosition3; p++) {
    let s5;
    if (p === 1) {
      s5 = 0;
    } else {
      let os3 = Math.max(baseProps[p - 2].stretch3, 0.0001);
      s5 = excessDistance * (os3 / positiveStretch);
    }

    let d = 1 + s5;
    x += d * Math.cos(angle);
    y += d * Math.sin(angle);
    coordinates.push(new VirtualBaseCoordinates(x, y));
  }

  return coordinates;
}

export default baseCoordinatesStraight;
