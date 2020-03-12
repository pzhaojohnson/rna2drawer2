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
  let boundingAngle5 = ur.boundingStem5.angle + (Math.PI / 2);

  function done() {
    return p > q;
  }

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

  function straightDistance() {
    return baseCoordinates(p - 1).distanceBetweenCenters(baseCoordinates(q + 1));
  }

  function polarLength() {
    return polarizeLength(p - q + 2);
  }
  
  function bisectingAngle() {
    let bstoa5 = ur.boundingStem5.angle;
    let bstoa3 = normalizeAngle(ur.boundingStem3.angle, bstoa5);
    return (bstoa5 + bstoa3) / 2;
  }

  function boundingAngle3() {
    let bsa = bisectingAngle();
    let ba5 = normalizeAngle(boundingAngle5, bsa);
    return bsa - (ba5 - bsa);
  }

  function angleSpan() {
    let a5 = boundingAngle5 - (Math.PI / 2);
    let a3 = normalizeAngle(boundingAngle3() + (Math.PI / 2), a5);
    return a3 - a5;
  }
  
  function boundingRadius() {
    return (straightDistance() / 2) / Math.sin(angleSpan() / 2);
  }

  function boundingPolarLength() {
    return boundingRadius() * angleSpan();
  }

  function tooLong() {
    return polarLength() > boundingPolarLength();
  }

  function boundingPair() {
    let r = boundingRadius();
    let xCenter = baseCoordinates(p - 1).xLeft + (r * Math.cos(boundingAngle5 + (Math.PI / 2)));
    let yCenter = baseCoordinates(p - 1).yTop + (r * Math.sin(boundingAngle5 + (Math.PI / 2)));
    
    let aincr = angleSpan() * (polarizeLength(1) / boundingPolarLength());
    let a = boundingAngle5 - (Math.PI / 2) + aincr;
    
    setBaseCoordinates(
      p,
      xCenter + (r * Math.cos(a)),
      yCenter + (r * Math.sin(a))
    );
    
    a = boundingAngle3() + (Math.PI / 2) - aincr;
    
    setBaseCoordinates(
      q,
      xCenter + (r * Math.cos(a)),
      yCenter + (r * Math.sin(a))
    );
    
    p++;
    q--;
    boundingAngle5 += aincr;
  }

  function triangularizeBoundingAngle5() {
    let hyp = Math.floor((q - p + 1) / 2);
    let obc = baseCoordinates(p - 1);
    let rbc = baseCoordinates(q + 1);
    let adj = (obc.distanceBetweenCenters(rbc) - 1) / 2;
    let a;
    
    // in case adj >= hyp due to imprecision in floating point arithmetic
    if (adj < hyp) {
      a = Math.acos(adj / hyp);
    } else {
      a = 0;
    }
    
    boundingAngle5 = bisectingAngle() + ((Math.PI / 2) - a);
  }

  function triangularPair() {
    if (p === q) {
      let obc = baseCoordinates(p - 1);
      let rbc = baseCoordinates(p + 1);
      
      setBaseCoordinates(
        p,
        ((obc.xLeft + rbc.xLeft) / 2) + Math.cos(bisectingAngle()),
        ((obc.yTop + rbc.yTop) / 2) + Math.sin(bisectingAngle())
      );
    } else {
      let obc = baseCoordinates(p - 1);
      
      setBaseCoordinates(
        p,
        obc.xLeft + Math.cos(boundingAngle5),
        obc.yTop + Math.sin(boundingAngle5)
      );
      
      let rbc = baseCoordinates(q + 1);
      
      setBaseCoordinates(
        q,
        rbc.xLeft + Math.cos(boundingAngle3()),
        rbc.yTop + Math.sin(boundingAngle3())
      );
    }
    
    p++;
    q--;
  }

  function round() {
    let cc = circleCenter(
      baseCoordinates(p - 1).xLeft,
      baseCoordinates(p - 1).yTop,
      baseCoordinates(q + 1).xLeft,
      baseCoordinates(q + 1).yTop,
      polarLength(),
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
    angle5 = normalizeAngle(angle5, angle3);

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

  if (!done() && tooLong()) {
    boundingPair();
  }

  while (!done() && tooLong() && angleSpan() > Math.PI) {
    boundingPair();
  }

  if (!done() && tooLong()) {
    triangularizeBoundingAngle5();

    while (!done() && tooLong()) {
      triangularPair();
    }
  }

  if (!done()) {
    round();
  }

  return coordinates;
}

export default baseCoordinatesTriangularRound;
