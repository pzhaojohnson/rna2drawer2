import VirtualBaseCoordinates from '../../VirtualBaseCoordinates';
import distanceBetween from '../../../distanceBetween';
import angleBetween from '../../../angleBetween';
import { circleCenter } from './circle';

class RoundLoop {

  /**
   * @param {Stem} st 
   * 
   * @returns {number} The X coordinate of the center of the round loop of a given stem.
   */
  static xCenter(st) {
    let cc = circleCenter(
      st.xTopLeft,
      st.yTopLeft,
      st.xTopRight,
      st.yTopRight,
      st.loopLength,
    );
    return cc.x;
  }

  /**
   * @param {Stem} st 
   * 
   * @returns {number} The Y coordinate of the center of the round loop of a given stem.
   */
  static yCenter(st) {
    let cc = circleCenter(
      st.xTopLeft,
      st.yTopLeft,
      st.xTopRight,
      st.yTopRight,
      st.loopLength,
    );
    return cc.y;
  }

  /**
   * Sets the coordinates and angles for all stems of a layout given its outermost stem.
   * 
   * @param {Stem} outermostStem The outermost stem of the layout.
   * @param {StrictLayoutGeneralProps} generalProps The drawing properties of the layout.
   * @param {Array<StrictLayoutBaseProps>} baseProps The base properties of the layout.
   */
  static setCoordinatesAndAngles(outermostStem, generalProps, baseProps) {
    outermostStem.xBottomCenter = 0;
    outermostStem.yBottomCenter = 0;
    outermostStem.angle = generalProps.rotation - (Math.PI / 2);

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
    let xCenter = RoundLoop.xCenter(st);
    let yCenter = RoundLoop.yCenter(st);

    let bottomCenterDistance = distanceBetween(xCenter, yCenter, st.xTopCenter, st.yTopCenter);
    
    let circumference = st.loopLength + st.width;
    let angle = angleBetween(xCenter, yCenter, st.xTopCenter, st.yTopCenter);
    angle += (2 * Math.PI) * ((st.width / 2) / circumference);
    
    let it = st.loopIterator();
    let iur = it.next().value;
    let next = it.next();
    let ist = next.value;

    while (!next.done) {
      angle += (2 * Math.PI) * ((iur.length + (ist.width / 2)) / circumference);
      
      ist.xBottomCenter = xCenter + (bottomCenterDistance * Math.cos(angle));
      ist.yBottomCenter = yCenter + (bottomCenterDistance * Math.sin(angle));
      ist.angle = angle;
      StemLayout.setInnerCoordinatesAndAngles(ist, generalProps, baseProps);
      
      angle += (2 * Math.PI) * ((ist.width / 2) / circumference);
      
      iur = it.next().value;
      next = it.next();
      ist = next.value;
    }
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
      return TriangleLoop._heightMultipleBranches(st, generalProps);
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
   * @param {StrictLayoutGeneralProps} generalProps The drawing properties of the layout.
   * 
   * @returns {number} The height of the triangle loop of a given stem
   *  that has multiple stems in its loop.
   */
  static _heightMultipleBranches(st, generalProps) {
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

    let maxAngle = Math.max(0.001, generalProps.maxTriangleLoopAngle / 2);
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
   * @param {Array<StrictLayoutBaseProps} baseProps 
   * 
   * @returns {Array<VirtualBaseCoordinates>} The coordinates for the bases in the unpaired region.
   */
  static traverseUnpairedRegion53(ur, baseProps) {
    let coordinates = [];
    let x = ur.baseCoordinatesBounding5().xLeft;
    let y = ur.baseCoordinatesBounding5().yTop;
    let angle = ur.boundingStem5.angle + (Math.PI / 2);

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
   * @param {Array<StrictLayoutBaseProps} baseProps 
   */
  static setNextCoordinatesAndAngle53(ur, baseProps) {
    let coordinates = FlatOutermostLoop.traverseUnpairedRegion53(ur, baseProps);
    
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
    if (coordinates.length === 0) {
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
    outermostStem.xBottomCenter = 0;
    outermostStem.yBottomCenter = 0;
    outermostStem.angle = generalProps.rotation - (Math.PI / 2);

    let it = outermostStem.loopIterator();
    let ur = it.next().value;
    let next = it.next();

    while (!next.done) {
      let st = next.value;
      FlatOutermostLoop.setNextCoordinatesAndAngle53(ur, baseProps);
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
