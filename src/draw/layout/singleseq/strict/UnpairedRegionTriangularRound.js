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
 * @returns {Array<VirtualBaseCoordinates>} 
 */
function baseCoordinatesTriangularRound(ur, generalProps) {
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

  function circularRadius() {
    if (ur.boundingStem5.isOutermostStem()) {
      let center = RoundLoop.center(ur.boundingStem5, generalProps);
      let bcb3 = ur.baseCoordinatesBounding3();
      return distanceBetween(center.x, center.y, bcb3.xCenter, bcb3.yCenter);
    } else if (ur.boundingStem3.isOutermostStem()) {
      let center = RoundLoop.center(ur.boundingStem3, generalProps);
      let bcb5 = ur.baseCoordinatesBounding5();
      return distanceBetween(center.x, center.y, bcb5.xCenter, bcb5.yCenter);
    } else {
      let a5 = ur.boundingStemOutwardAngle5;
      let a3 = ur.boundingStemOutwardAngle3;
      a3 = normalizeAngle(a3, a5);
      let bisectingAngle = (a5 + a3) / 2;
      
      let bcb5 = ur.baseCoordinatesBounding5();
      let bcb3 = ur.baseCoordinatesBounding3();
      let opp = bcb5.distanceBetweenCenters(bcb3) / 2;

      let sin = Math.sin(Math.PI - (bisectingAngle - a5));
      sin = Math.max(sin, 0.001);
      return opp / sin;
    }
  }

  function circularCircumference() {
    return 2 * Math.PI * circularRadius();
  }

  function circularCenter() {
    if (ur.boundingStem5.isOutermostStem()) {
      return RoundLoop.center(ur.boundingStem5, generalProps);
    } else if (ur.boundingStem3.isOutermostStem()) {
      return RoundLoop.center(ur.boundingStem3, generalProps);
    } else {
      let radius = circularRadius();
      let bcb5 = ur.baseCoordinatesBounding5();
      return {
        x: bcb5.xCenter + (radius * Math.cos(ur.boundingStem5.reverseAngle)),
        y: bcb5.yCenter + (radius * Math.sin(ur.boundingStem5.reverseAngle)),
      };
    }
  }

  function circularAngle5() {
    if (ur.boundingStem5.isOutermostStem()) {
      return generalProps.rotation + Math.PI
        + ((2 * Math.PI) * ((generalProps.terminiGap / 2) / circularCircumference()));
    } else if (ur.boundingStem3.isOutermostStem()) {
      let center = circularCenter();
      let bcb5 = ur.baseCoordinatesBounding5();
      return angleBetween(center.x, center.y, bcb5.xCenter, bcb5.yCenter);
    } else {
      return ur.boundingStem5.angle;
    }
  }

  function circularAngle3() {
    if (ur.boundingStem5.isOutermostStem()) {
      let center = circularCenter();
      let bcb3 = ur.baseCoordinatesBounding3();
      return angleBetween(center.x, center.y, bcb3.xCenter, bcb3.yCenter);
    } else if (ur.boundingStem3.isOutermostStem()) {
      return generalProps.rotation + Math.PI
        + ((2 * Math.PI) * ((generalProps.terminiGap / 2) / circularCircumference()));
    } else {
      return ur.boundingStem3.angle;
    }
  }

  function circularPolarLength() {
    let a5 = circularAngle5();
    let a3 = circularAngle3();
    a3 = normalizeAngle(a3, a5);
    return circularRadius() * (a3 - a5);
  }

  function circularPairs() {
    let radius = circularRadius();
    let circumference = circularCircumference();
    let center = circularCenter();
    let a5 = circularAngle5();
    let a3 = circularAngle3();
    a3 = normalizeAngle(a3, a5);
    if (ur.boundingStem5.isOutermostStem()) {
      a5 += (2 * Math.PI) * (0.5 / circumference);
      a3 -= (2 * Math.PI) * (1 / circumference);
    } else if (ur.boundingStem3.isOutermostStem()) {
      a5 += (2 * Math.PI) * (1 / circumference);
      a3 -= (2 * Math.PI) * (0.5 / circumference);
    } else {
      a5 += (2 * Math.PI) * (1 / circumference);
      a3 -= (2 * Math.PI) * (1 / circumference);
    }
    
    function done() {
      return p > q || a3 - a5 <= Math.PI;
    }

    function addingFirstCirclePair() {
      return p === ur.boundingPosition5 + 1
        && q === ur.boundingPosition3 - 1
        && p <= q
        && q - p + 2 > circularPolarLength();
    }

    while (!done() || addingFirstCirclePair()) {
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
      return q - p + 1 <= 2
        || q - p + 2 <= (Math.PI - (2 * a)) * radius;
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

  function smushedRoundPairs() {
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

  if (q - p + 2 <= circularPolarLength()) {
    smushedRoundPairs();
  } else {
    circularPairs();
    trianglePairs();
    smushedRoundPairs();
  }
  return coordinates;
}

export default baseCoordinatesTriangularRound;
