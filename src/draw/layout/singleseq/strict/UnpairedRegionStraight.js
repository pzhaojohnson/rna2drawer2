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
    ps += Math.max(0, baseProps[p - 1].stretch3);
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
  let cbp5 = ur.baseCoordinatesBounding5();
  let cbp3 = ur.baseCoordinatesBounding3();
  let a = cbp5.angleBetweenCenters(cbp3);

  let positiveStretch = _positiveStretch(ur);
  let excessDistance = (cbp5.distanceBetweenCenters(cbp3) - 1) - ur.size;
  
  let x = cbp5.xLeft;
  let y = cbp5.yTop;

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
    x += d * Math.cos(a);
    y += d * Math.sin(a);
    coordinates.push(new VirtualBaseCoordinates(x, y));
  }

  return coordinates;
}

export default baseCoordinatesStraight;
