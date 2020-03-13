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

  let cc = circleCenter(
    st.xTopLeft,
    st.yTopLeft,
    st.xTopRight,
    st.yTopRight,
    ur.polarLength,
  );

  let xCenter = cc.x;
  let yCenter = cc.y;

  let bcb5 = ur.baseCoordinatesBounding5();
  let bcb3 = ur.baseCoordinatesBounding3();
  let radius = distanceBetween(xCenter, yCenter, bcb5.xCenter, bcb5.yCenter);
  let angle5 = angleBetween(xCenter, yCenter, bcb5.xCenter, bcb5.yCenter);
  let angle3 = angleBetween(xCenter, yCenter, bcb3.xCenter, bcb3.yCenter);
  angle3 = normalizeAngle(angle3, angle5);

  let aincr = (angle3 - angle5) / (ur.size + 1);
  let a = angle5 + aincr;
  
  for (let p = ur.boundingPosition5 + 1; p < ur.boundingPosition3; p++) {
    coordinates.push(new VirtualBaseCoordinates(
      xCenter + (radius * Math.cos(angle)) - 0.5,
      yCenter + (radius * Math.sin(angle)) - 0.5,
    ));
    a += aincr;
  }
  
  return coordinates;
}

export default baseCoordinatesHairpin;
