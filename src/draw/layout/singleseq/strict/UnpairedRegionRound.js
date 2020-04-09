import NormalizedBaseCoordinates from '../../NormalizedBaseCoordinates';
import normalizeAngle from '../../../normalizeAngle';
import { circleCenter } from './circleCenter';
import distanceBetween from '../../../distanceBetween';
import angleBetween from '../../../angleBetween';
import { RoundLoop } from './StemLayout';

const _VERY_SMALL_THRESHOLD = 0.001;

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
    let c = RoundLoop.center(ur.boundingStem5, generalProps);
    let r = RoundLoop.radius(ur.boundingStem5, generalProps);
    let angle = RoundLoop.terminusAngle5(ur.boundingStem5, generalProps);
    return {
      x: c.x + (r * Math.cos(angle)),
      y: c.y + (r * Math.sin(angle)),
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
    let c = RoundLoop.center(ur.boundingStem3, generalProps);
    let r = RoundLoop.radius(ur.boundingStem3, generalProps);
    let angle = RoundLoop.terminusAngle3(ur.boundingStem3, generalProps);
    return {
      x: c.x + (r * Math.cos(angle)),
      y: c.y + (r * Math.sin(angle)),
    };
  } else {
    let bcb3 = ur.baseCoordinatesBounding3();
    return { x: bcb3.xCenter, y: bcb3.yCenter };
  }
}

/**
 * The polar length to fit between the bounds.
 * 
 * @param {UnpairedRegion} ur 
 * 
 * @returns {number} 
 */
function _polarLengthToFit(ur) {
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
  let bs5 = ur.boundingStem5;
  let bs3 = ur.boundingStem3;
  let verySmallTerminiGap = generalProps.terminiGap < _VERY_SMALL_THRESHOLD;
  if (bs5.isOutermostStem() && bs3.isOutermostStem() && verySmallTerminiGap) {
    let cb5 = _coordinatesBounding5(ur, generalProps);
    let circumference = _polarLengthToFit(ur, generalProps);
    let radius = circumference / (2 * Math.PI);
    let angle = RoundLoop.originAngle(bs5, generalProps) + Math.PI;
    return {
      x: cb5.x + (radius * Math.cos(angle)),
      y: cb5.y + (radius * Math.sin(angle)),
    };
  } else {
    let cb5 = _coordinatesBounding5(ur, generalProps);
    let cb3 = _coordinatesBounding3(ur, generalProps);
    let polarLengthToFit = _polarLengthToFit(ur);
    return circleCenter(cb5.x, cb5.y, cb3.x, cb3.y, polarLengthToFit);
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
  return distanceBetween(center.x, center.y, cb5.x, cb5.y);
}

function _angleBounding5(ur, generalProps) {
  let center = _center(ur, generalProps);
  let cb5 = _coordinatesBounding5(ur, generalProps);
  return angleBetween(center.x, center.y, cb5.x, cb5.y);
}

function _angleBounding3(ur, generalProps) {
  let center = _center(ur, generalProps);
  let cb3 = _coordinatesBounding3(ur, generalProps);
  return angleBetween(center.x, center.y, cb3.x, cb3.y);
}

function _angleSpanBetweenBounds(ur, generalProps) {
  let bs5 = ur.boundingStem5;
  let bs3 = ur.boundingStem3;
  let verySmallTerminiGap = generalProps.terminiGap < _VERY_SMALL_THRESHOLD;
  if (bs5.isOutermostStem() && bs3.isOutermostStem() && verySmallTerminiGap) {
    return 2 * Math.PI;
  } else {
    let angle5 = _angleBounding5(ur, generalProps);
    let angle3 = _angleBounding3(ur, generalProps);
    angle3 = normalizeAngle(angle3, angle5);
    return angle3 - angle5;
  }
}

function _polarLengthBetweenBounds(ur, generalProps) {
  let angleSpan = _angleSpanBetweenBounds(ur, generalProps);
  let radius = _radius(ur, generalProps);
  return angleSpan * radius;
}

/**
 * @param {UnpairedRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * 
 * @returns {number} 
 */
function _startingAngle(ur, generalProps) {
  if (ur.size === 0) {
    return 0;
  } else if (ur.boundingStem5.isOutermostStem()) {
    let angle5 = _angleBounding5(ur, generalProps);
    let angleSpan = _angleSpanBetweenBounds(ur, generalProps);
    let polarLengthBetweenBounds = _polarLengthBetweenBounds(ur, generalProps);
    return angle5 + (angleSpan * (0.5 / polarLengthBetweenBounds));
  } else {
    let angle5 = _angleBounding5(ur, generalProps);
    let angleSpan = _angleSpanBetweenBounds(ur, generalProps);
    if (ur.boundingStem3.isOutermostStem()) {
      let polarLengthBetweenBounds = _polarLengthBetweenBounds(ur, generalProps);
      angleSpan += angleSpan * (0.5 / polarLengthBetweenBounds);
    }
    return angle5 + (angleSpan / (ur.size + 1));
  }
}

/**
 * @param {UnpairedRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * 
 * @returns {number} 
 */
function _angleIncrement(ur, generalProps) {
  if (ur.size === 0) {
    return 0;
  } else {
    let startingAngle = _startingAngle(ur, generalProps);
    let angle3 = _angleBounding3(ur, generalProps);
    angle3 = normalizeAngle(angle3, startingAngle);
    if (ur.boundingStem3.isOutermostStem()) {
      let angleSpan = _angleSpanBetweenBounds(ur, generalProps);
      let polarLengthBetweenBounds = _polarLengthBetweenBounds(ur, generalProps);
      angle3 += angleSpan * (0.5 / polarLengthBetweenBounds);
    }
    return (angle3 - startingAngle) / ur.size;
  }
}

/**
 * @param {UnpairedRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * 
 * @returns {Array<NormalizedBaseCoordinates>} 
 */
function baseCoordinatesRound(ur, generalProps) {
  if (ur.size === 0) {
    return [];
  } else {
    let coordinates = [];
    let center = _center(ur, generalProps);
    let radius = _radius(ur, generalProps);
    let angle = _startingAngle(ur, generalProps);
    let angleIncrement = _angleIncrement(ur, generalProps);
    for (let p = ur.boundingPosition5 + 1; p < ur.boundingPosition3; p++) {
      let xCenter = center.x + (radius * Math.cos(angle));
      let yCenter = center.y + (radius * Math.sin(angle));
      coordinates.push(new NormalizedBaseCoordinates(xCenter - 0.5, yCenter - 0.5));
      angle += angleIncrement;
    }
    return coordinates;
  }
}

export {
  baseCoordinatesRound,

  // these are only exported to aid testing
  _coordinatesBounding5,
  _coordinatesBounding3,
  _polarLengthToFit,
  _center,
  _radius,
  _angleBounding5,
  _angleBounding3,
  _angleSpanBetweenBounds,
  _polarLengthBetweenBounds,
  _startingAngle,
  _angleIncrement,
};
