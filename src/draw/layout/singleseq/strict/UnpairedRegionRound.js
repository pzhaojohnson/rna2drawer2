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
 * @returns {Array<VirtualBaseCoordinates>} 
 */
function baseCoordinatesRound(ur, generalProps) {
  if (ur.size === 0) {
    return [];
  }

  let coordinates = new Array(ur.size);
  let p = ur.boundingPosition5 + 1;
  let q = ur.boundingPosition3 - 1;
  
  function baseCoordinates(position) {
    if (position === ur.boundingPosition5) {
      return ur.baseCoordinatesBounding5();
    } else if (position === ur.boundingPosition3) {
      return ur.baseCoordinatesBounding3();
    } else {
      return coordinates[position - ur.boundingPosition5 - 1];
    }
  }
  
  function setBaseCoordinates(position, xLeft, yTop) {
    let i = position - ur.boundingPosition5 - 1;
    coordinates[i] = new VirtualBaseCoordinates(xLeft, yTop);
  }

  function circularPairs() {
    let radius = _circularRadius(ur, generalProps);
    let circumference = _circularCircumference(ur, generalProps);
    let center = _circularCenter(ur, generalProps);
    let a5 = _circularAngle5(ur, generalProps);
    let a3 = _circularAngle3(ur, generalProps);
    a3 = normalizeAngle(a3, a5);
    a5 += (2 * Math.PI) * (0.5 / circumference);
    a3 -= (2 * Math.PI) * (0.5 / circumference);
    
    function done() {
      return p > q || a3 - a5 <= Math.PI;
    }

    function addingFirstPair() {
      return p === ur.boundingPosition5 + 1
        && q === ur.boundingPosition3 - 1
        && p <= q;
    }

    while (!done() || addingFirstPair()) {
      setBaseCoordinates(
        p,
        center.x + (radius * Math.cos(a5)) - 0.5,
        center.y + (radius * Math.sin(a5)) - 0.5,
      );
      setBaseCoordinates(
        q,
        center.x + (radius * Math.cos(a3)) - 0.5,
        center.y + (radius * Math.sin(a3)) - 0.5,
      );
      p++;
      q--;
      a5 += (2 * Math.PI) * (1 / circumference);
      a3 -= (2 * Math.PI) * (1 / circumference);
    }
  }

  function trianglePairs() {
    let obc = baseCoordinates(p - 1);
    let rbc = baseCoordinates(q + 1);
    
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
      let bc5 = baseCoordinates(p - 1);
      let bc3 = baseCoordinates(q + 1);
      let radius = (bc5.distanceBetweenCenters(bc3) / 2) / Math.cos(a);
      return q - p + 2 <= (Math.PI - (2 * a)) * radius
        || q - p + 1 <= 2;
    }

    while (!done()) {
      let bc5 = baseCoordinates(p - 1);
      setBaseCoordinates(
        p,
        bc5.xLeft + Math.cos(a5),
        bc5.yTop + Math.sin(a5)
      );
      let bc3 = baseCoordinates(q + 1);
      setBaseCoordinates(
        q,
        bc3.xLeft + Math.cos(a3),
        bc3.yTop + Math.sin(a3)
      );
      p++;
      q--;
    }
  }

  function roundCoordinates() {
    let obc = baseCoordinates(p - 1);
    let rbc = baseCoordinates(q + 1);
    let cc = circleCenter(obc.xLeft, obc.yTop, rbc.xLeft, rbc.yTop, q - p + 2);
    let radius = distanceBetween(cc.x, cc.y, obc.xLeft, obc.yTop);
    let a5 = angleBetween(cc.x, cc.y, obc.xLeft, obc.yTop);
    let a3 = angleBetween(cc.x, cc.y, rbc.xLeft, rbc.yTop);
    
    a3 = normalizeAngle(a3, a5);
    let aincr = (a3 - a5) / (q - p + 2);
    let a = a5 + aincr;
    for (let z = p; z <= q; z++) {
      setBaseCoordinates(
        z,
        cc.x + (radius * Math.cos(a)),
        cc.y + (radius * Math.sin(a))
      );
      a += aincr;
    }
  }

  let bs5 = ur.boundingStem5;
  let bs3 = ur.boundingStem3;
  let neitherStemIsOutermost = !bs5.isOutermostStem() && !bs3.isOutermostStem();

  if (neitherStemIsOutermost && q - p + 1 <= _circularPolarLength(ur, generalProps)) {
    roundCoordinates();
  } else {
    circularPairs();
    trianglePairs();
    roundCoordinates();
  }
  return coordinates;
}

export default baseCoordinatesRound;
