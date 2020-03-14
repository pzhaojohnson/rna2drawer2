import VirtualBaseCoordinates from '../../VirtualBaseCoordinates';
import normalizeAngle from '../../../normalizeAngle';
import { polarizeLength, circleCenter } from './circle';
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

  function circlePairs() {
    let angle5 = ur.boundingStem5.angle;
    let angle3 = ur.boundingStem3.angle;
    angle3 = normalizeAngle(angle3, angle5);
    let bisectingAngle = (angle5 + angle3) / 2;

    let bcb5 = ur.baseCoordinatesBounding5();
    let bcb3 = ur.baseCoordinatesBounding3();
    let o = bcb5.distanceBetweenCenters(bcb3) / 2;
    let radius = o / Math.sin(bisectingAngle - angle5);

    let xCenter = bcb5.xLeft + (radius * Math.cos(angle5 + Math.PI));
    let yCenter = bcb5.yTop + (radius * Math.sin(angle5 + Math.PI));

    let circumference = 2 * Math.PI * radius;
    let a5 = angle5 + ((2 * Math.PI) * ((ur.boundingStem5.polarWidth / 2) / circumference));
    let a3 = angle3 - ((2 * Math.PI) * ((ur.boundingStem3.polarWidth / 2) / circumference));
    let aincr = (2 * Math.PI) * (polarizeLength(1) / circumference);
    a5 += aincr;
    a3 += aincr;

    function done() {
      return p > q
        || a3 - a5 <= Math.PI
        || polarizeLength(q - p + 2) <= (a3 - a5) * radius;
    }

    while (!done()) {
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
    
    let hyp;
    let opp;
    if (p - q + 1 % 2 === 0) {
      hyp = (p - q + 1) / 2;
      opp = obc.distanceBetweenCenters(rbc) - 1;
    } else {
      hyp = (p - q + 2) / 2;
      opp = obc.distanceBetweenCenters(rbc);
    }
    opp = Math.min(opp, hyp - 0.001);
    
    let bisectingAngle = obc.angleBetweenCenters(rbc) - (Math.PI / 2);
    let a = Math.asin(opp / hyp);
    let a5 = bisectingAngle + a;
    let a3 = bisectingAngle - a;

    function done() {
      obc = baseCoordinates(p - 1);
      rbc = baseCoordinates(q + 1);
      return p > q
        || polarizeLength(p - q + 2) <= (a5 - a3) * (obc.distanceBetweenCenters(rbc) / 2);
    }

    while (!done()) {
      obc = baseCoordinates(p - 1);
      setBaseCoordinates(
        p,
        obc.xLeft + Math.cos(a5),
        obc.yTop + Math.sin(a5)
      );
      rbc = baseCoordinates(q + 1);
      setBaseCoordinates(
        q,
        rbc.xLeft + Math.cos(a3),
        rbc.yTop + Math.sin(a3)
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
      polarizeLength(p - q + 2),
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

    let aincr = (angle3 - angle5) / (p - q + 2);
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

  circlePairs();
  trianglePairs();
  smushedRoundPairs();
  return coordinates;
}

export default baseCoordinatesTriangularRound;
