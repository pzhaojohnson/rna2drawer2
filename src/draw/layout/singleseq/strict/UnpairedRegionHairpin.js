import VirtualBaseCoordinates from '../../VirtualBaseCoordinates';
import { circleCenter } from './circleCenter';
import distanceBetween from '../../../distanceBetween';
import angleBetween from '../../../angleBetween';
import normalizeAngle from '../../../normalizeAngle';

/**
 * @param {UnpairedRegion} ur 
 * 
 * @returns {Array<VirtualBaseCoordinates>} 
 */
function baseCoordinatesHairpin(ur) {
  let coordinates = [];
  let bcb5 = ur.baseCoordinatesBounding5();
  let bcb3 = ur.baseCoordinatesBounding3();
  
  let cc = circleCenter(bcb5.xLeft, bcb5.yTop, bcb3.xLeft, bcb3.yTop, ur.length);
  let angle5 = angleBetween(cc.x, cc.y, bcb5.xLeft, bcb5.yTop);
  let angle3 = angleBetween(cc.x, cc.y, bcb3.xLeft, bcb3.yTop);
  angle3 = normalizeAngle(angle3, angle5);

  let aincr = (angle3 - angle5) / (ur.size + 1);
  let a = angle5 + aincr;

  let radius = distanceBetween(cc.x, cc.y, bcb5.xLeft, bcb5.yTop);
  let polarLength = (angle3 - angle5) * radius;
  let semicircleLength = Math.PI * bcb5.distanceBetweenCenters(bcb3) / 2;

  if (polarLength < semicircleLength) {
    let diameter = 2 * semicircleLength / Math.PI;
    radius += 1 - ((polarLength - diameter) / (semicircleLength - diameter));
  }
  
  for (let p = ur.boundingPosition5 + 1; p < ur.boundingPosition3; p++) {
    coordinates.push(new VirtualBaseCoordinates(
      cc.x + (radius * Math.cos(a)),
      cc.y + (radius * Math.sin(a)),
    ));
    a += aincr;
  }

  return coordinates;
}

export default baseCoordinatesHairpin;
