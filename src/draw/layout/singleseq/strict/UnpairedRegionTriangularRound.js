import VirtualBaseCoordinates from '../../VirtualBaseCoordinates';
import normalizeAngle from '../../../normalizeAngle';
import { circleCenter } from './circle';
import distanceBetween from '../../../distanceBetween';
import angleBetween from '../../../angleBetween';

/**
 * @param {UnpairedRegion} ur 
 * 
 * @returns {Array<VirtualBaseCoordinates>} The base coordinates of all positions in the given unpaired region
 *  drawn in a triangular round manner.
 */
function baseCoordinatesTriangularRound(ur) {
  let coordinates = new Array(ur.size);
  let p = ur.boundingPosition5 + 1;
  let q = ur.boundingPosition3 - 1;
  
  function baseCoordinates(position) {
    if (position < ur.boundingPosition5 || position > ur.boundingPosition3) {
      throw new Error("Position is out of range.");
    } else if (position === ur.boundingPosition5) {
      return ur.baseCoordinatesBounding5();
    } else if (position === ur.boundingPosition3) {
      return ur.baseCoordinatesBounding3();
    } else {
      return coordinates[position - ur.boundingPosition5 - 1];
    }
  }
  
  function setBaseCoordinates(position, xLeft, yTop) {
    coordinates[position - ur.boundingPosition5 - 1] = new VirtualBaseCoordinates(xLeft, yTop);
  }

  function radiusFromStems() {
    let a5 = ur.boundingStem5.angle;
    let a3 = ur.boundingStem3.angle;
    a3 = normalizeAngle(a3, a5);
    let bisectingAngle = (a5 + a3) / 2;
    
    let bcb5 = ur.baseCoordinatesBounding5();
    let bcb3 = ur.baseCoordinatesBounding3();
    let opp = bcb5.distanceBetweenCenters(bcb3) / 2;

    return opp / Math.max(
      Math.sin(Math.PI - (bisectingAngle - a5)),
      0.001,
    );
  }

  function polarLengthFromStems() {
    let a5 = ur.boundingStem5.angle;
    let a3 = ur.boundingStem3.angle;
    a3 = normalizeAngle(a3, a5);
    return radiusFromStems() * (a3 - a5);
  }

  function circlePairs() {
    let radius = radiusFromStems();
    
    let angleToCenter = ur.boundingStem5.angle + Math.PI;
    let bcb5 = ur.baseCoordinatesBounding5();
    let xCenter = bcb5.xLeft + (radius * Math.cos(angleToCenter));
    let yCenter = bcb5.yTop + (radius * Math.sin(angleToCenter));
    
    let circumference = 2 * Math.PI * radius;
    let aincr = (2 * Math.PI) * (1 / circumference);
    let a5 = ur.boundingStem5.angle + aincr;
    let a3 = ur.boundingStem3.angle - aincr;
    a3 = normalizeAngle(a3, a5);
    
    function done() {
      return p > q || a3 - a5 <= Math.PI;
    }

    function addingFirstCirclePair() {
      return p === ur.boundingPosition5 + 1
        && q === ur.boundingPosition3 - 1
        && q - p + 2 > polarLengthFromStems();
    }

    while (!done() || addingFirstCirclePair()) {
      setBaseCoordinates(
        p,
        xCenter + (radius * Math.cos(a5)),
        yCenter + (radius * Math.sin(a5)),
      );
      setBaseCoordinates(
        q,
        xCenter + (radius * Math.cos(a3)),
        yCenter + (radius * Math.sin(a3)),
      );
      p++;
      q--;
      a5 += aincr;
      a3 -= aincr;
    }
  }

  function trianglePairs() {
    let obc = baseCoordinates(p - 1);
    let rbc = baseCoordinates(q + 1);
    
    let hyp = (q - p + 2) / 2;
    let opp = obc.distanceBetweenCenters(rbc) / 2;
    hyp = Math.max(hyp, 0.002);
    opp = Math.min(opp, hyp - 0.001);
    
    let bisectingAngle = obc.angleBetweenCenters(rbc) - (Math.PI / 2);
    let a = Math.asin(opp / hyp) / 2;
    let a5 = bisectingAngle + a;
    let a3 = bisectingAngle - a;

    function done() {
      let bc5 = baseCoordinates(p - 1);
      let bc3 = baseCoordinates(q + 1);
      let radius = (bc5.distanceBetweenCenters(bc3) / 2) / Math.cos(a);
      return p >= q
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
    let cc = circleCenter(
      baseCoordinates(p - 1).xLeft,
      baseCoordinates(p - 1).yTop,
      baseCoordinates(q + 1).xLeft,
      baseCoordinates(q + 1).yTop,
      q - p + 2,
    );
    let xCenter = cc.x;
    let yCenter = cc.y;

    let r = distanceBetween(
      xCenter,
      yCenter,
      baseCoordinates(p - 1).xLeft,
      baseCoordinates(p - 1).yTop,
    );

    let angle5 = angleBetween(
      xCenter,
      yCenter,
      baseCoordinates(p - 1).xLeft,
      baseCoordinates(p - 1).yTop,
    );
    let angle3 = angleBetween(
      xCenter,
      yCenter,
      baseCoordinates(q + 1).xLeft,
      baseCoordinates(q + 1).yTop,
    );
    angle3 = normalizeAngle(angle3, angle5);

    let aincr = (angle3 - angle5) / (q - p + 2);
    let a = angle5 + aincr;
    
    for (let s = p; s <= q; s++) {
      setBaseCoordinates(
        s,
        xCenter + (r * Math.cos(a)),
        yCenter + (r * Math.sin(a))
      );
      a += aincr;
    }
  }

  if (q - p + 2 <= polarLengthFromStems()) {
    smushedRoundPairs();
  } else {
    circlePairs();
    trianglePairs();
    smushedRoundPairs();
  }

  return coordinates;
}

export default baseCoordinatesTriangularRound;
