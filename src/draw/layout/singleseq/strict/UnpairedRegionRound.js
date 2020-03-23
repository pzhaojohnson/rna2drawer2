import VirtualBaseCoordinates from '../../VirtualBaseCoordinates';
import normalizeAngle from '../../../normalizeAngle';
import { circleCenter } from './circle';
import distanceBetween from '../../../distanceBetween';
import angleBetween from '../../../angleBetween';
import { RoundLoop } from './StemLayout';

/**
 * @param {UnpairedRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * 
 * @returns {number} 
 */
function _circularRadius(ur, generalProps) {
  if (ur.boundingStem5.isOutermostStem()) {
    return RoundLoop.radius(ur.boundingStem5, generalProps);
  } else if (ur.boundingStem3.isOutermostStem()) {
    return RoundLoop.radius(ur.boundingStem3, generalProps);
  } else {
    let a5 = ur.boundingStemOutwardAngle5;
    let a3 = ur.boundingStemOutwardAngle3;
    a3 = normalizeAngle(a3, a5);
    let bisectingAngle = (a5 + a3) / 2;
    let sin = Math.sin(Math.PI - (bisectingAngle - a5));
    sin = Math.max(sin, 0.001);
    let bcb5 = ur.baseCoordinatesBounding5();
    let bcb3 = ur.baseCoordinatesBounding3();
    let opp = bcb5.distanceBetweenCenters(bcb3) / 2;
    return opp / sin;
  }
}

/**
 * @param {UnpairedRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * 
 * @returns {number} 
 */
function _circularCircumference(ur, generalProps) {
  return 2 * Math.PI * _circularRadius(ur, generalProps);
}

/**
 * @typedef {Object} CircularCenter 
 * @property {number} x 
 * @property {number} y 
 */

/**
 * @param {UnpairedRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * 
 * @returns {CircularCenter} 
 */
function _circularCenter(ur, generalProps) {
  if (ur.boundingStem5.isOutermostStem()) {
    return RoundLoop.center(ur.boundingStem5, generalProps);
  } else if (ur.boundingStem3.isOutermostStem()) {
    return RoundLoop.center(ur.boundingStem3, generalProps);
  } else {
    let radius = _circularRadius(ur, generalProps);
    let bcb5 = ur.baseCoordinatesBounding5();
    return {
      x: bcb5.xCenter + (radius * Math.cos(ur.boundingStemOutwardAngle5 + Math.PI)),
      y: bcb5.yCenter + (radius * Math.sin(ur.boundingStemOutwardAngle5 + Math.PI)),
    };
  }
}

/**
 * @param {UnpairedRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * 
 * @returns {number} 
 */
function _circularAngle5(ur, generalProps) {
  let circumference = _circularCircumference(ur, generalProps);
  if (ur.boundingStem5.isOutermostStem()) {
    return generalProps.rotation + Math.PI
      + ((2 * Math.PI) * ((generalProps.terminiGap / 2) / circumference));
  } else if (ur.boundingStem3.isOutermostStem()) {
    return ur.boundingStemOutwardAngle5
      + ((2 * Math.PI) * ((ur.boundingStem5.width / 2) / circumference));
  } else {
    return ur.boundingStemOutwardAngle5
      + ((2 * Math.PI) * (0.5 / circumference));
  }
}

/**
 * @param {UnpairedRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * 
 * @returns {number} 
 */
function _circularAngle3(ur, generalProps) {
  let circumference = _circularCircumference(ur, generalProps);
  if (ur.boundingStem5.isOutermostStem()) {
    return ur.boundingStemOutwardAngle3
      - ((2 * Math.PI) * ((ur.boundingStem3.width / 2) / circumference));
  } else if (ur.boundingStem3.isOutermostStem()) {
    return generalProps.rotation + Math.PI
      - ((2 * Math.PI) * ((generalProps.terminiGap / 2) / circumference));
  } else {
    return ur.boundingStemOutwardAngle3
      - ((2 * Math.PI) * (0.5 / circumference));
  }
}

/**
 * @param {UnpairedRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * 
 * @returns {number} 
 */
function _circularPolarLength(ur, generalProps) {
  let a5 = _circularAngle5(ur, generalProps);
  let a3 = _circularAngle3(ur, generalProps);
  a3 = normalizeAngle(a3, a5);
  return _circularRadius(ur, generalProps) * (a3 - a5);
}

/**
 * @param {UnpairedRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * 
 * @returns {boolean} 
 */
function _noCircularOrTriangularPairs(ur, generalProps) {
  return ur.size <= _circularPolarLength(ur, generalProps)
    && !ur.boundingStem5.isOutermostStem()
    && !ur.boundingStem3.isOutermostStem();
}

function _circularPairs(ur, generalProps) {
  if (_noCircularOrTriangularPairs(ur, generalProps)) {
    return { coordinates5: [], coordinates3: [] };
  }

  let radius = _circularRadius(ur, generalProps);
  let circumference = _circularCircumference(ur, generalProps);
  let center = _circularCenter(ur, generalProps);
  let a5 = _circularAngle5(ur, generalProps);
  let a3 = _circularAngle3(ur, generalProps);
  a3 = normalizeAngle(a3, a5);
  a5 += (2 * Math.PI) * (0.5 / circumference);
  a3 -= (2 * Math.PI) * (0.5 / circumference);
  let p = ur.boundingPosition5 + 1;
  let q = ur.boundingPosition3 - 1;
  
  function done() {
    let addingFirstPair = p === ur.boundingPosition5 + 1;
    return p > q || (a3 - a5 <= Math.PI && !addingFirstPair);
  }

  let cs5 = [];
  let cs3 = [];
  while (!done()) {
    if (p < q) {
      cs5.push(new VirtualBaseCoordinates(
        center.x + (radius * Math.cos(a5)) - 0.5,
        center.y + (radius * Math.sin(a5)) - 0.5,
      ));
    }
    cs3.unshift(new VirtualBaseCoordinates(
      center.x + (radius * Math.cos(a3)) - 0.5,
      center.y + (radius * Math.sin(a3)) - 0.5,
    ));
    p++;
    q--;
    a5 += (2 * Math.PI) * (1 / circumference);
    a3 -= (2 * Math.PI) * (1 / circumference);
  }
  return { coordinates5: cs5, coordinates3: cs3 };
}

function _trianglePairs(ur, generalProps, p, q, obc, rbc) {
  if (_noCircularOrTriangularPairs(ur, generalProps)) {
    return { coordinates5: [], coordinates3: [] };
  }

  let hyp = (q - p + 2) / 2;
  hyp = Math.max(hyp, 0.001);
  let opp = (obc.distanceBetweenCenters(rbc) / 2) - 0.5;
  opp = Math.max(opp, 0);
  opp = Math.min(opp, hyp - 0.00001);
  
  let bisectingAngle = obc.angleBetweenCenters(rbc) - (Math.PI / 2);
  let a = Math.asin(opp / hyp) / 2;
  let a5 = bisectingAngle + a;
  let a3 = bisectingAngle - a;

  function done() {
    let radius = (obc.distanceBetweenCenters(rbc) / 2) / Math.cos(a);
    return q - p + 2 <= (Math.PI - (2 * a)) * radius
      || q - p + 1 <= 2;
  }

  let cs5 = [];
  let cs3 = [];
  while (!done()) {
    let bc = new VirtualBaseCoordinates(
      obc.xLeft + Math.cos(a5),
      obc.yTop + Math.sin(a5)
    );
    cs5.push(bc);
    obc = bc;
    bc = new VirtualBaseCoordinates(
      rbc.xLeft + Math.cos(a3),
      rbc.yTop + Math.sin(a3)
    );
    cs3.unshift(bc);
    rbc = bc;
    p++;
    q--;
  }
  return { coordinates5: cs5, coordinates3: cs3 };
}

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

  let p = ur.boundingPosition5 + 1;
  let q = ur.boundingPosition3 - 1;
  let obc = ur.baseCoordinatesBounding5();
  let rbc = ur.baseCoordinatesBounding3();

  let circular = _circularPairs(ur, generalProps);
  p += circular.coordinates5.length;
  q -= circular.coordinates3.length;
  if (circular.coordinates5.length > 0) {
    obc = circular.coordinates5[circular.coordinates5.length - 1];
  }
  if (circular.coordinates3.length > 0) {
    rbc = circular.coordinates3[0];
  }

  let triangular = _trianglePairs(ur, generalProps, p, q, obc, rbc);
  p += triangular.coordinates5.length;
  q -= triangular.coordinates3.length;
  if (triangular.coordinates5.length > 0) {
    obc = triangular.coordinates5[triangular.coordinates5.length - 1];
  }
  if (triangular.coordinates3.length > 0) {
    rbc = triangular.coordinates3[0];
  }

  return [].concat(
    circular.coordinates5,
    triangular.coordinates5,
    _roundCoordinates(p, q, obc, rbc),
    triangular.coordinates3,
    circular.coordinates3,
  );
}

export default baseCoordinatesRound;
