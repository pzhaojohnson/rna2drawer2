import VirtualBaseCoordinates from '../../VirtualBaseCoordinates';
import { circleCenter } from './circle';
import { circleCircumference } from './circleCircumference';
import angleBetween from '../../../angleBetween';
import distanceBetween from '../../../distanceBetween';
import Stem from './Stem';

class RoundLoop {

  /**
   * @param {Stem} st 
   * @param {StrictLayoutGeneralProps} generalProps 
   * 
   * @returns {number} 
   */
  static circumference(st, generalProps) {
    let straightLength = Stem.width(generalProps) - 1;
    let numStraights = st.numBranches;
    if (!st.isOutermostStem()) {
      numStraights += 1;
    }
    let remainingPolarLength = st.loopLength - (st.numBranches * straightLength);
    if (st.isOutermostStem()) {
      remainingPolarLength += generalProps.terminiGap;
    } else {
      remainingPolarLength += 1;
    }
    return circleCircumference(straightLength, numStraights, remainingPolarLength);
  }

  /**
   * @param {Stem} st 
   * @param {StrictLayoutGeneralProps} generalProps 
   * 
   * @returns {number} 
   */
  static radius(st, generalProps) {
    return RoundLoop.circumference(st, generalProps) / (2 * Math.PI);
  }

  /**
   * @typedef {Object} RoundLoop~Center 
   * @property {number} x 
   * @property {number} y 
   */
  
  /**
   * @param {Stem} st 
   * @param {StrictLayoutGeneralProps} generalProps 
   * 
   * @returns {RoundLoop~Center} 
   */
  static center(st, generalProps) {
    if (st.isOutermostStem()) {
      return { x: 0, y: 0 };
    } else if (st.numBranches === 0) {
      let bct5 = st.baseCoordinatesTop5();
      let bct3 = st.baseCoordinatesTop3();
      return circleCenter(
        bct5.xCenter,
        bct5.yCenter,
        bct3.xCenter,
        bct3.yCenter,
        st.loopLength + 1,
      );
    } else {
      let radius = RoundLoop.radius(st, generalProps);
      let bct5 = st.baseCoordinatesTop5();
      let bct3 = st.baseCoordinatesTop3();
      let opp = bct5.distanceBetweenCenters(bct3) / 2;
      let asin = Math.asin(opp / radius);
      let angle = bct5.angleBetweenCenters(bct3) - (Math.PI / 2) + asin;
      return {
        x: bct5.xCenter + (radius * Math.cos(angle)),
        y: bct5.yCenter + (radius * Math.sin(angle)),
      };
    }
  }

  /**
   * @param {Stem} st 
   * @param {StrictLayoutGeneralProps} generalProps 
   * 
   * @returns {number} 
   */
  static originAngle(st, generalProps) {
    if (st.isOutermostStem()) {
      return generalProps.rotation + Math.PI;
    } else {
      return st.reverseAngle;
    }
  }

  /**
   * @param {Stem} outermostStem 
   * @param {StrictLayoutGeneralProps} generalProps 
   * 
   * @returns {number} 
   */
  static polarLengthBetweenTermini(outermostStem, generalProps) {
    if (outermostStem.numBranches === 0) {
      return outermostStem.loopLength;
    } else {
      let radius = RoundLoop.radius(outermostStem, generalProps);
      let stemWidth = Stem.width(generalProps);
      let basePairAngleSpan = 2 * Math.asin(((stemWidth - 1) / 2) / radius);
      let basePairPolarLength = radius * basePairAngleSpan;
      return outermostStem.loopLength
        - (outermostStem.numBranches * (stemWidth - 1))
        + (outermostStem.numBranches * basePairPolarLength);
    }
  }

  /**
   * @param {Stem} outermostStem 
   * @param {StrictLayoutGeneralProps} generalProps 
   * 
   * @returns {number} 
   */
  static terminusAngle5(outermostStem, generalProps) {
    if (outermostStem.numBranches === 0) {
      let circumference = RoundLoop.circumference(outermostStem, generalProps);
      return RoundLoop.originAngle(outermostStem, generalProps)
        + ((2 * Math.PI) * ((generalProps.terminiGap / 2) / circumference));
    } else {
      let circumference = RoundLoop.circumference(outermostStem, generalProps);
      let polarLength = RoundLoop.polarLengthBetweenTermini(outermostStem, generalProps);
      return RoundLoop.originAngle(outermostStem, generalProps)
        + Math.PI
        - ((2 * Math.PI) * ((polarLength / 2) / circumference));
    }
  }

  /**
   * @param {Stem} outermostStem 
   * @param {StrictLayoutGeneralProps} generalProps 
   * 
   * @returns {number} 
   */
  static terminusAngle3(outermostStem, generalProps) {
    if (outermostStem.numBranches === 0) {
      let circumference = RoundLoop.circumference(outermostStem, generalProps);
      return RoundLoop.originAngle(outermostStem, generalProps)
        - ((2 * Math.PI) * ((generalProps.terminiGap / 2) / circumference));
    } else {
      let circumference = RoundLoop.circumference(outermostStem, generalProps);
      let polarLength = RoundLoop.polarLengthBetweenTermini(outermostStem, generalProps);
      return RoundLoop.originAngle(outermostStem, generalProps)
        + Math.PI
        + ((2 * Math.PI) * ((polarLength / 2) / circumference));
    }
  }

  /**
   * Sets the coordinates and angles for all stems of a layout given its outermost stem.
   * 
   * @param {Stem} outermostStem 
   * @param {StrictLayoutGeneralProps} generalProps 
   * @param {Array<StrictLayoutBaseProps>} baseProps 
   */
  static setCoordinatesAndAngles(outermostStem, generalProps, baseProps) {
    RoundLoop.setInnerCoordinatesAndAngles(outermostStem, generalProps, baseProps);
  }

  /**
   * Recursively sets the coordinates and angles of stems inner to a given stem.
   * 
   * @param {Stem} st 
   * @param {StrictLayoutGeneralProps} generalProps 
   * @param {Array<StrictLayoutBaseProps>} baseProps 
   */
  static setInnerCoordinatesAndAngles(st, generalProps, baseProps) {
    if (st.numBranches === 0) {
      return;
    } else {
      let center = RoundLoop.center(st, generalProps);
      let circumference = RoundLoop.circumference(st, generalProps);
      let radius = RoundLoop.radius(st, generalProps);
      let stemWidth = Stem.width(generalProps);
      let basePairAngleSpan = 2 * Math.asin(((stemWidth - 1) / 2) / radius);
      let bottomCenterRadius = (radius * Math.cos(basePairAngleSpan / 2)) - 0.5;
      let angle;
      if (st.isOutermostStem()) {
        angle = RoundLoop.terminusAngle5(st, generalProps);
      } else {
        let bct5 = st.baseCoordinatesTop5();
        angle = angleBetween(center.x, center.y, bct5.xCenter, bct5.yCenter)
          + ((2 * Math.PI) * (0.5 / circumference));
      }
      let it = st.loopIterator();
      let iur = it.next().value;
      let next = it.next();
      while (!next.done) {
        let ist = next.value;
        angle += ((2 * Math.PI) * (iur.length / circumference));
        angle += ((2 * Math.PI) * (0.5 / circumference));
        angle += basePairAngleSpan / 2;
        ist.xBottomCenter = center.x + (bottomCenterRadius * Math.cos(angle));
        ist.yBottomCenter = center.y + (bottomCenterRadius * Math.sin(angle));
        ist.angle = angle;
        StemLayout.setInnerCoordinatesAndAngles(ist, generalProps, baseProps);
        angle += basePairAngleSpan / 2;
        angle += ((2 * Math.PI) * (0.5 / circumference));
        iur = it.next().value;
        next = it.next();
      }
    }
    /*
    let center = RoundLoop.center(st, generalProps);
    let radius = RoundLoop.radius(st, generalProps);
    let circumference = RoundLoop.circumference(st, generalProps);
    
    let stemWidth = Stem.width(generalProps);
    let bondAngleSpan = 2 * Math.asin(((stemWidth - 1) / 2) / radius);
    let it = st.loopIterator();
    let iur = it.next().value;

    let angle = RoundLoop.originAngle(st, generalProps);
    angle += (2 * Math.PI) * (iur.length / circumference);
    if (st.isOutermostStem()) {
      angle += (2 * Math.PI) * ((generalProps.terminiGap / 2) / circumference);
    } else {
      angle += bondAngleSpan / 2;
      angle += (2 * Math.PI) * (0.5 / circumference);
    }
    
    let next = it.next();
    let ist = next.value;
    while (!next.done) {
      angle += (2 * Math.PI) * (0.5 / circumference);
      let a5 = angle;
      let x5 = center.x + (radius * Math.cos(a5));
      let y5 = center.y + (radius * Math.sin(a5));
      angle += bondAngleSpan;
      let a3 = angle;
      let x3 = center.x + (radius * Math.cos(a3));
      let y3 = center.y + (radius * Math.sin(a3));
      let aMiddle = (a5 + a3) / 2;
      let xMiddle = (x5 + x3) / 2;
      let yMiddle = (y5 + y3) / 2;
      ist.angle = aMiddle;
      ist.xBottomCenter = xMiddle + (0.5 * Math.cos(aMiddle + Math.PI));
      ist.yBottomCenter = yMiddle + (0.5 * Math.sin(aMiddle + Math.PI));
      StemLayout.setInnerCoordinatesAndAngles(ist, generalProps, baseProps);
      
      angle += (2 * Math.PI) * (0.5 / circumference);
      iur = it.next().value;
      angle += (2 * Math.PI) * (iur.length / circumference);
      next = it.next();
      ist = next.value;
    }
    */
  }
}

class TriangleLoop {

  /**
   * @param {Stem} st 
   * 
   * @returns {number} 
   */
  static platformLength(st) {
    let length = 0;
    let it = st.loopIterator();
    it.next();
    let next = it.next();
    while (!next.done) {
      let ist = next.value;
      length += ist.width;
      let ur = it.next().value;
      if (ur.boundingPosition3 < st.positionTop3) {
        length += ur.length;
      }
      next = it.next();
    }
    return length;
  }

  /**
   * The height of a triangle loop is defined as the distance between the top center point
   * of its outer stem and the bottom of the platform of the triangle loop.
   * 
   * @param {Stem} st 
   * @param {StrictLayoutGeneralProps} generalProps The drawing properties of the layout.
   * 
   * @returns {number} The height of the triangle loop of a given stem.
   */
  static height(st, generalProps) {
    if (st.hasHairpinLoop()) {
      return 0;
    } else if (st.numBranches === 1) {
      return TriangleLoop._heightOneBranch(st);
    } else {
      return TriangleLoop._heightMultipleBranches(st);
    }
  }

  /**
   * @param {Stem} st 
   * 
   * @returns {number} The height of the triangle loop of a given stem
   *  that has only one stem in its loop.
   */
  static _heightOneBranch(st) {
    let it = st.loopIterator();
    let ur5 = it.next().value;
    it.next();
    let ur3 = it.next().value;

    let greater = Math.max(ur5.length, ur3.length);
    let halfCircumference = greater + 1;
    let circumference = 2 * halfCircumference;
    let diameter = circumference / Math.PI;

    /* Subtract one since the height is defined as the distance between the top of the outer stem
    and the bottom of the inner stem. */
    return diameter - 1;
  }

  /**
   * @param {Stem} st 
   * 
   * @returns {number} The height of the triangle loop of a given stem
   *  that has multiple stems in its loop.
   */
  static _heightMultipleBranches(st) {
    let it = st.loopIterator();
    let urFirst = it.next().value;
    let next = it.next();
    let urLast = null;
    while (!next.done) {
      urLast = it.next().value;
      next = it.next();
    }

    let platformLength = TriangleLoop.platformLength(st);
    let opp = (platformLength - st.width) / 2;
    let hyp = Math.max(
      urFirst.length + 1,
      urLast.length + 1,
      opp + 0.001,
    );
    let height = ((hyp ** 2) - (opp ** 2)) ** 0.5;

    let maxAngle = Math.max(0.001, st.maxTriangleLoopAngle / 2);
    maxAngle = Math.min(Math.PI / 2 - 0.001, maxAngle);
    let minHyp = opp / Math.sin(maxAngle);
    let minHeight = ((minHyp ** 2) - (opp ** 2)) ** 0.5;
    return Math.max(height, minHeight) - 1;
  }

  /**
   * Recursively sets the coordinates and angles of stems inner to a given stem.
   * 
   * @param {Stem} st 
   * @param {StrictLayoutGeneralProps} generalProps The drawing properties of the layout.
   * @param {Array<StrictLayoutBaseProps>} baseProps The base properties of the layout.
   */
  static setInnerCoordinatesAndAngles(st, generalProps, baseProps) {
    if (!st.hasHairpinLoop()) {
      let x = st.xTopCenter;
      let y = st.yTopCenter;

      let height = TriangleLoop.height(st, generalProps);
      x += height * Math.cos(st.angle);
      y += height * Math.sin(st.angle);

      let platformLength = TriangleLoop.platformLength(st);
      x += (platformLength / 2) * Math.cos(st.angle - (Math.PI / 2));
      y += (platformLength / 2) * Math.sin(st.angle - (Math.PI / 2));

      let it = st.loopIterator();

      // skip first unpaired region
      it.next();

      let next = it.next();

      while (!next.done) {
        let ist = next.value;
        x += (ist.width / 2) * Math.cos(st.angle + (Math.PI / 2));
        y += (ist.width / 2) * Math.sin(st.angle + (Math.PI / 2));
        ist.xBottomCenter = x;
        ist.yBottomCenter = y;
        ist.angle = st.angle;
        StemLayout.setInnerCoordinatesAndAngles(ist, generalProps, baseProps);

        let ur = it.next().value;
        x += ((ist.width / 2) + ur.length) * Math.cos(st.angle + (Math.PI / 2));
        y += ((ist.width / 2) + ur.length) * Math.sin(st.angle + (Math.PI / 2));

        next = it.next();
      }
    }
  }
}

class FlatOutermostLoop {

  /**
   * Traverses the unpaired region 5' to 3', using the coordinates and angle of the 5' bounding stem
   * of the unpaired region as a starting point.
   * 
   * @param {UnpairedRegion} ur 
   * @param {StrictLayoutGeneralProps} generalProps 
   * @param {Array<StrictLayoutBaseProps} baseProps 
   * 
   * @returns {Array<VirtualBaseCoordinates>} The coordinates for the bases in the unpaired region.
   */
  static traverseUnpairedRegion53(ur, generalProps, baseProps) {
    let coordinates = [];
    let x;
    let y;
    let angle;
    if (ur.boundingStem5.isOutermostStem()) {
      x = 0;
      y = 0;
      angle = generalProps.rotation;
    } else {
      x = ur.baseCoordinatesBounding5().xLeft;
      y = ur.baseCoordinatesBounding5().yTop;
      angle = ur.boundingStem5.angle + (Math.PI / 2);
    }

    for (let p = ur.boundingPosition5 + 1; p < ur.boundingPosition3; p++) {
      let d = 1;
      if (p > 1) {
        d += Math.max(0, baseProps[p - 2].stretch3);
        angle += baseProps[p - 2].flatOutermostLoopAngle3;
      }
      x += d * Math.cos(angle);
      y += d * Math.sin(angle);
      coordinates.push(new VirtualBaseCoordinates(x, y));
    }

    return coordinates;
  }

  /**
   * Sets the coordinates and angle of the 3' bounding stem of the given unpaired region
   * based on the coordinates and angle of the 5' bounding stem of the unpaired region.
   * 
   * @param {UnpairedRegion} ur 
   * @param {StrictLayoutGeneralProps} generalProps 
   * @param {Array<StrictLayoutBaseProps} baseProps 
   */
  static setNextCoordinatesAndAngle53(ur, generalProps, baseProps) {
    let coordinates = FlatOutermostLoop.traverseUnpairedRegion53(ur, generalProps, baseProps);
    
    let x;
    let y;
    if (coordinates.length === 0) {
      x = ur.baseCoordinatesBounding5().xCenter;
      y = ur.baseCoordinatesBounding5().yCenter;
    } else {
      x = coordinates[ur.size - 1].xCenter;
      y = coordinates[ur.size - 1].yCenter;
    }

    let angle;
    if (ur.boundingStem5.isOutermostStem() && coordinates.length < 2) {
      angle = generalProps.rotation;
    } else if (coordinates.length === 0) {
      angle = ur.boundingStem5.angle + (Math.PI / 2);
    } else if (coordinates.length === 1) {
      angle = ur.baseCoordinatesBounding5().angleBetweenCenters(coordinates[0]);
    } else {
      angle = coordinates[ur.size - 2].angleBetweenCenters(coordinates[ur.size - 1]);
    }
    if (ur.boundingPosition3 > 1) {
      angle += baseProps[ur.boundingPosition3 - 2].flatOutermostLoopAngle3;
    }

    let d = 0.5 + (ur.boundingStem3.width / 2);
    if (ur.boundingPosition3 > 1) {
      d += Math.max(0, baseProps[ur.boundingPosition3 - 2].stretch3);
    }
    
    x += d * Math.cos(angle);
    y += d * Math.sin(angle);
    x += 0.5 * Math.cos(angle + (Math.PI / 2));
    y += 0.5 * Math.sin(angle + (Math.PI / 2));

    ur.boundingStem3.xBottomCenter = x;
    ur.boundingStem3.yBottomCenter = y;
    ur.boundingStem3.angle = angle - (Math.PI / 2);
  }

  /**
   * Sets the coordinates and angles for all stems in the layout.
   * 
   * @param {Stem} outermostStem 
   * @param {StrictLayoutGeneralProps} generalProps 
   * @param {Array<StrictLayoutBaseProps>} baseProps 
   */
  static setCoordinatesAndAngles(outermostStem, generalProps, baseProps) {
    let it = outermostStem.loopIterator();
    let ur = it.next().value;
    let next = it.next();

    while (!next.done) {
      let st = next.value;
      FlatOutermostLoop.setNextCoordinatesAndAngle53(ur, generalProps, baseProps);
      StemLayout.setInnerCoordinatesAndAngles(st, generalProps, baseProps);
      ur = it.next().value;
      next = it.next();
    }
  }
}

class StemLayout {

  /**
   * Sets the coordinates and angles for all stems in the layout.
   * 
   * @param {Stem} outermostStem The outermost stem of the layout.
   * @param {StrictLayoutGeneralProps} generalProps The drawing properties of the layout.
   * @param {Array<StrictLayoutBaseProps>} baseProps The base properties of the layout.
   * 
   * @throws {Error} If the loop of the outermost stem is not flat or round.
   */
  static setCoordinatesAndAngles(outermostStem, generalProps, baseProps) {
    if (generalProps.flatOutermostLoop) {
      FlatOutermostLoop.setCoordinatesAndAngles(outermostStem, generalProps, baseProps);
    } else if (outermostStem.hasRoundLoop()) {
      RoundLoop.setCoordinatesAndAngles(outermostStem, generalProps, baseProps);
    } else {
      throw new Error("The loop of the outermost stem must be either flat or round.");
    }
  }

  /**
   * Recursively sets the coordinates and angles for stems inner to the given stem.
   * 
   * @param {Stem} st 
   * @param {StrictLayoutGeneralProps} generalProps The drawing properties of the layout.
   * @param {Array<StrictLayoutBaseProps>} baseProps The base properties of the layout.
   * 
   * @throws {Error} If the loop of the stem is not round or triangular.
   */
  static setInnerCoordinatesAndAngles(st, generalProps, baseProps) {
    if (st.hasRoundLoop()) {
      RoundLoop.setInnerCoordinatesAndAngles(st, generalProps, baseProps);
    } else if (st.hasTriangleLoop()) {
      TriangleLoop.setInnerCoordinatesAndAngles(st, generalProps, baseProps);
    } else {
      throw new Error("Stem has an unrecognized loop shape.");
    }
  }
}

export {
  RoundLoop,
  TriangleLoop,
  FlatOutermostLoop,
  StemLayout,
};
