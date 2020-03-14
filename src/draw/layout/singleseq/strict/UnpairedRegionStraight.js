import VirtualBaseCoordinates from '../../VirtualBaseCoordinates';

/**
 * @param {UnpairedRegion} ur 
 * @param {Array<StrictLayoutBaseProps>} baseProps The base properties of the layout.
 * 
 * @returns {number} The sum of the positive 3' stretches that contribute to the length
 *  of the given unpaired region.
 */
function _positiveStretch(ur, baseProps) {
  let ps = 0;

  for (let p = ur.boundingPosition5; p < ur.boundingPosition3; p++) {

    // in case the 5' bounding position is zero
    if (p > 0) {
      ps += Math.max(0, baseProps[p - 1].stretch3);
    }
  }

  return ps;
}

/**
 * @param {UnpairedRegion} ur 
 * @param {Array<StrictLayoutBaseProps>} baseProps The base properties of the layout.
 * 
 * @returns {Array<VirtualBaseCoordinates>} The base coordinates of all positions in the given unpaired region
 *  in a straight line connecting the bounding positions of the given unpaired region.
 */
function baseCoordinatesStraight(ur, baseProps) {
  let coordinates = [];
  let bcb5 = ur.baseCoordinatesBounding5();
  let bcb3 = ur.baseCoordinatesBounding3();
  
  let positiveStretch = Math.max(
    _positiveStretch(ur, baseProps),
    0.001,
  );
  
  let totalDistance = bcb5.distanceBetweenCenters(bcb3);

  let excessDistance = Math.max(
    totalDistance - (ur.size + 1),
    0,
  );
  
  let angle = bcb5.angleBetweenCenters(bcb3);

  let x = bcb5.xLeft;
  let y = bcb5.yTop;

  for (let p = ur.boundingPosition5 + 1; p < ur.boundingPosition3; p++) {
    let s;

    if (p === 1) {
      s = 0;
    } else {
      s = Math.max(
        0,
        excessDistance * (baseProps[p - 2].stretch3 / positiveStretch)
      );
    }

    let d = 1 + s;
    x += d * Math.cos(angle);
    y += d * Math.sin(angle);
    coordinates.push(new VirtualBaseCoordinates(x, y));
  }

  return coordinates;
}

export default baseCoordinatesStraight;
