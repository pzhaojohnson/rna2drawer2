import VirtualBaseCoordinates from '../../VirtualBaseCoordinates';
import normalizeAngle from '../../../normalizeAngle';
import { circleCenter } from './circle';
import distanceBetween from '../../../distanceBetween';
import angleBetween from '../../../angleBetween';
import { RoundLoop } from './StemLayout';

function _roundCoordinates(p, q, obc, rbc) {
  let cc = circleCenter(obc.xLeft, obc.yTop, rbc.xLeft, rbc.yTop, q - p + 2);
  let radius = distanceBetween(cc.x, cc.y, obc.xLeft, obc.yTop);
  let a5 = angleBetween(cc.x, cc.y, obc.xLeft, obc.yTop);
  let a3 = angleBetween(cc.x, cc.y, rbc.xLeft, rbc.yTop);
  
  a3 = normalizeAngle(a3, a5);
  let aincr = (a3 - a5) / (q - p + 2);
  let a = a5 + aincr;
  let coordinates = [];
  for (let z = p; z <= q; z++) {
    coordinates.push(new VirtualBaseCoordinates(
      cc.x + (radius * Math.cos(a)),
      cc.y + (radius * Math.sin(a))
    ));
    a += aincr;
  }
  return coordinates;
}

/**
 * @param {UnpairedRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * 
 * @returns {Array<VirtualBaseCoordinates>} 
 */
function baseCoordinatesRound(ur, generalProps) {
  if (ur.size === 0) {
    return [];
  }

  return _roundCoordinates(
    ur.boundingPosition5 + 1,
    ur.boundingPosition3 - 1,
    ur.baseCoordinatesBounding5(),
    ur.baseCoordinatesBounding3(),
  );
}

export default baseCoordinatesRound;
