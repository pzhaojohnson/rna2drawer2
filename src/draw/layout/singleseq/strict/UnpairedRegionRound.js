import VirtualBaseCoordinates from '../../VirtualBaseCoordinates';
import normalizeAngle from '../../../normalizeAngle';
import { circleCenter } from './circle';
import distanceBetween from '../../../distanceBetween';
import angleBetween from '../../../angleBetween';
import { RoundLoop } from './StemLayout';

/**
 * @typedef {Object} Coordinates 
 * @property {number} x 
 * @property {number} y 
 */

/**
 * @param {UnpairedRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * 
 * @returns {Coordinates} 
 */
function _coordinatesBounding5(ur, generalProps) {
  if (ur.boundingStem5.isOutermostStem()) {
    let center = RoundLoop.center(ur.boundingStem5, generalProps);
    let radius = RoundLoop.radius(ur.boundingStem5, generalProps);
    let circumference = RoundLoop.circumference(ur.boundingStem5, generalProps);
    let angle = RoundLoop.originAngle(ur.boundingStem5, generalProps);
    angle += (2 * Math.PI) * ((generalProps.terminiGap / 2) / circumference);
    return {
      x: center.x + (radius * Math.cos(angle)),
      y: center.y + (radius * Math.sin(angle)),
    };
  } else {
    let bcb5 = ur.baseCoordinatesBounding5();
    return { x: bcb5.xCenter, y: bcb5.yCenter };
  }
}

/**
 * @param {UnpairedRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * 
 * @returns {Coordinates} 
 */
function _coordinatesBounding3(ur, generalProps) {
  if (ur.boundingStem3.isOutermostStem()) {
    let center = RoundLoop.center(ur.boundingStem3, generalProps);
    let radius = RoundLoop.radius(ur.boundingStem3, generalProps);
    let circumference = RoundLoop.circumference(ur.boundingStem3, generalProps);
    let angle = RoundLoop.originAngle(ur.boundingStem3, generalProps);
    angle -= (2 * Math.PI) * ((generalProps.terminiGap / 2) / circumference);
    return {
      x: center.x + (radius * Math.cos(angle)),
      y: center.y + (radius * Math.sin(angle)),
    };
  } else {
    let bcb3 = ur.baseCoordinatesBounding3();
    return { x: bcb3.xCenter, y: bcb3.yCenter };
  }
}

/**
 * @param {UnpairedRegion} ur 
 * 
 * @returns {number} 
 */
function _polarDistanceIncludingBounds(ur) {
  if (ur.boundingStem5.isOutermostStem() && ur.boundingStem3.isOutermostStem()) {
    return ur.size;
  } else if (ur.boundingStem5.isOutermostStem() || ur.boundingStem3.isOutermostStem()) {
    return ur.size + 0.5;
  } else {
    return ur.size + 1;
  }
}

/**
 * @param {UnpairedRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * 
 * @returns {Coordinates} 
 */
function _center(ur, generalProps) {
  let bothStemsAreOutermost = ur.boundingStem5.isOutermostStem()
    && ur.boundingStem3.isOutermostStem();
  
  if (bothStemsAreOutermost && generalProps.terminiGap < 0.001) {
    return RoundLoop.center(ur, generalProps);
  } else {
    let cb5 = _coordinatesBounding5(ur, generalProps);
    let cb3 = _coordinatesBounding3(ur, generalProps);
    let polarDistance = _polarDistanceIncludingBounds(ur);
    return circleCenter(cb5.x, cb5.y, cb3.x, cb3.y, polarDistance);
  }
}

/**
 * @param {UnpairedRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * 
 * @returns {number} 
 */
function _radius(ur, generalProps) {
  let center = _center(ur, generalProps);
  let cb5 = _coordinatesBounding5(ur, generalProps);
  let radius = distanceBetween(center.x, center.y, cb5.x, cb5.y);
  if (ur.isHairpinLoop() && !ur.boundingStem5.isOutermostStem()) {
    let angle5 = angleBetween(center.x, center.y, cb5.x, cb5.y);
    let cb3 = _coordinatesBounding3();
    let angle3 = angleBetween(center.x, center.y, cb3.x, cb3.y);
    angle3 = normalizeAngle(angle3, angle5);
    let polarDistance = (angle3 - angle5) * radius;
    let straightDistance = distanceBetween(cb5.x, cb5.y, cb3.x, cb3.y);
    let semicircleDistance = Math.PI * straightDistance / 2;
    if (polarDistance < semicircleDistance) {
      radius += 1 - ((polarDistance - straightDistance) / (semicircleDistance - straightDistance));
    }
  }
  return radius;
}

/**
 * @param {UnpairedRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * 
 * @returns {number} 
 */
function _angleIncrement(ur, generalProps) {
  let center = _center(ur, generalProps);
  let cb5 = _coordinatesBounding5(ur, generalProps);
  let cb3 = _coordinatesBounding3(ur, generalProps);
  let angle5 = angleBetween(center.x, center.y, cb5.x, cb5.y);
  let angle3 = angleBetween(center.x, center.y, cb3.x, cb3.y);
  angle3 = normalizeAngle(angle3, angle5);
  let polarDistance = _polarDistanceIncludingBounds(ur);
  return (angle3 - angle5) / polarDistance;
}

/**
 * @param {UnpairedRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * 
 * @returns {number} 
 */
function _startingAngle(ur, generalProps) {
  let center = _center(ur, generalProps);
  let cb5 = _coordinatesBounding5(ur, generalProps);
  let angle = angleBetween(center.x, center.y, cb5.x, cb5.y);
  let angleIncrement = _angleIncrement(ur, generalProps);
  if (ur.boundingStem5.isOutermostStem()) {
    return angle + (0.5 * angleIncrement);
  } else {
    return angle + angleIncrement;
  }
}

/**
 * @param {UnpairedRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * 
 * @returns {Array<VirtualBaseCoordinates>} 
 */
function baseCoordinatesRound(ur, generalProps) {
  let center = _center(ur, generalProps);
  let radius = _radius(ur, generalProps);
  let angle = _startingAngle(ur, generalProps);
  let angleIncrement = _angleIncrement(ur, generalProps);
  let coordinates = [];
  for (let p = ur.boundingPosition5 + 1; p < ur.boundingPosition3; p++) {
    let xCenter = center.x + (radius * Math.cos(angle));
    let yCenter = center.y + (radius * Math.sin(angle));
    coordinates.push(new VirtualBaseCoordinates(xCenter - 0.5, yCenter - 0.5));
    angle += angleIncrement;
  }
  return coordinates;
}

export default baseCoordinatesRound;
