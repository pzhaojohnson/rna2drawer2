import VirtualBaseCoordinates from '../../VirtualBaseCoordinates';
import { polarizeLength, circleCenter } from './circle';
import distanceBetween from '../../../distanceBetween';
import angleBetween from '../../../angleBetween';
import normalizeAngle from '../../../normalizeAngle';

/**
 * @param {UnpairedRegion} ur 
 * 
 * @returns {Array<VirtualBaseCoordinates>} The base coordinates of all positions in the given unpaired region
 *  as a hairpin loop.
 */
function baseCoordinatesHairpin(ur) {
  let coordinates = [];

  let st = ur.boundingStem5;

  let bcb5 = ur.baseCoordinatesBounding5();
  let bcb3 = ur.baseCoordinatesBounding3();
  
  let cc = circleCenter(
    bcb5.xLeft,
    bcb5.yTop,
    bcb3.xLeft,
    bcb3.yTop,
    ur.polarLength,
  );

  let xCenter = cc.x;
  let yCenter = cc.y;

  let radius = distanceBetween(xCenter, yCenter, bcb5.xLeft, bcb5.yTop);

  let angle5 = angleBetween(xCenter, yCenter, bcb5.xLeft, bcb5.yTop);
  let angle3 = angleBetween(xCenter, yCenter, bcb3.xLeft, bcb3.yTop);
  angle3 = normalizeAngle(angle3, angle5);

  let aincr = (angle3 - angle5) / (ur.size + 1);
  let a = angle5 + aincr;

  let polarLength = (angle3 - angle5) * radius;
  let semicircleLength = Math.PI * bcb5.distanceBetweenCenters(bcb3) / 2;

  if (polarLength < semicircleLength) {
    radius += 1 - (polarLength / semicircleLength);
  }
  
  for (let p = ur.boundingPosition5 + 1; p < ur.boundingPosition3; p++) {
    coordinates.push(new VirtualBaseCoordinates(
      xCenter + (radius * Math.cos(a)),
      yCenter + (radius * Math.sin(a)),
    ));
    a += aincr;
  }

  return coordinates;
}

export default baseCoordinatesHairpin;
