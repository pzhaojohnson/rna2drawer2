import VirtualBaseCoordinates from '../../VirtualBaseCoordinates';
import distanceBetween from '../../../distanceBetween';

class RoundLoop {

  /**
   * @param {Stem} st 
   * 
   * @returns {number} The circumference of the round loop of a given stem.
   */
  static circumference(st) {
    let c = st.polarWidth;
    let it = st.loopIterator();

    // first unpaired region
    let next = it.next();
    c += next.value.polarLength;
    next = it.next();

    while (!next.done) {

      // a stem
      c += next.value.polarWidth;
      next = it.next();

      // an unpaired region
      c += next.value.polarLength;
      next = it.next();
    }
    
    return c;
  }

  /**
   * @param {Stem} st 
   * 
   * @returns {number} The diameter of the round loop of a given stem.
   */
  static diameter(st) {
    return RoundLoop.circumference(st) / Math.PI;
  }

  /**
   * @param {Stem} st 
   * 
   * @returns {number} The radius of the round loop of a given stem.
   */
  static radius(st) {
    return RoundLoop.diameter(st) / 2;
  }

  /**
   * @param {Stem} st 
   * 
   * @returns {number} The X coordinate of the center of the round loop of a given stem.
   */
  static xCenter(st) {
    let radius = RoundLoop.radius(st);
    let cpTop5 = st.baseCoordinatesTop5();
    let cpTop3 = st.baseCoordinatesTop3();
    let a = Math.asin((cpTop5.distanceBetweenCenters(cpTop3) / 2) / radius);
    return cpTop5.xCenter + (radius * Math.cos(st.angle + a));
  }

  /**
   * @param {Stem} st 
   * 
   * @returns {number} The Y coordinate of the center of the round loop of a given stem.
   */
  static yCenter(st) {
    let radius = RoundLoop.radius(st);
    let cpTop5 = st.baseCoordinatesTop5();
    let cpTop3 = st.baseCoordinatesTop3();
    let a = Math.asin((cpTop5.distanceBetweenCenters(cpTop3) / 2) / radius);
    return cpTop5.yBottom + (radius * Math.sin(st.angle + a));
  }

  /**
   * Sets the coordinates and angles for all stems of a layout given its outermost stem.
   * 
   * @param {Stem} outermostStem The outermost stem of the layout.
   * @param {StrictLayoutDrawingProps} drawingProps The drawing properties of the layout.
   * @param {Array<StrictLayoutBaseProps>} baseProps The base properties of the layout.
   */
  static setCoordinatesAndAngles(outermostStem, drawingProps, baseProps) {
    outermostStem.xBottomCenter = 0;
    outermostStem.yBottomCenter = 0;
    outermostStem.angle = drawingProps.rotation - (Math.PI / 2);

    RoundLoop.setInnerCoordinatesAndAngles(outermostStem, drawingProps, baseProps);
  }

  /**
   * Recursively sets the coordinates and angles of stems inner to a given stem.
   * 
   * @param {Stem} st 
   * @param {StrictLayoutDrawingProps} drawingProps The drawing properties of the layout.
   * @param {Array<StrictLayoutBaseProps>} baseProps The base properties of the layout.
   */
  static setInnerCoordinatesAndAngles(st, drawingProps, baseProps) {
    let circumference = RoundLoop.circumference(st);
    let xCenter = RoundLoop.xCenter(st);
    let yCenter = RoundLoop.yCenter(st);
    
    // the distance between the center of the loop and the bottom center point of an inner stem
    let stemDistance = distanceBetween(xCenter, yCenter, st.xTopCenter, st.yTopCenter);
    
    let angle = st.reverseAngle;
    angle += (2 * Math.PI) * ((st.polarWidth / 2) / circumference);
    
    let it = st.loopIterator();
    let iur = it.next().value;
    let next = it.next();
    let ist = next.value;

    while (!next.done) {
      angle += (2 * Math.PI) * ((iur.polarLength + (ist.polarWidth / 2)) / circumference);
      
      ist.xBottomCenter = xCenter + (stemDistance * Math.cos(angle));
      ist.yBottomCenter = yCenter + (stemDistance * Math.sin(angle));
      ist.angle = angle;
      StemLayout.setInnerCoordinatesAndAngles(ist, drawingProps, baseProps);

      angle += (2 * Math.PI) * ((ist.polarWidth / 2) / circumference);
      
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
   * @returns {number} The platform length of the triangle loop of a given stem.
   * 
   * @throws {Error} If the stem has a hairpin loop.
   */
  static platformLength(st) {
    if (st.hasHairpinLoop()) {
      throw new Error("A hairpin loop cannot have a platform.");
    }

    let length = 0;
    let it = st.loopIterator();
    
    // skip first unpaired region
    it.next();

    let next = it.next();
    
    while (!next.done) {
      let st = next.value;
      length += st.width;
      
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
   * @param {StrictLayoutDrawingProps} drawingProps The drawing properties of the layout.
   * 
   * @returns {number} The height of the triangle loop of a given stem.
   * 
   * @throws {Error} If the stem has a hairpin loop.
   */
  static height(st, drawingProps) {
    if (st.hasHairpinLoop()) {
      throw new Error("The given stem has a hairpin loop.");
    } else if (st.numBranches === 1) {
      return TriangleLoop._heightOneBranch(st);
    } else {
      return TriangleLoop._heightMultipleBranches(st, drawingProps);
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
    let ist = it.next().value;
    let ur3 = it.next().value;

    let greater = Math.max(ur5.polarLength, ur3.polarLength);
    let halfCircumference = greater + (st.polarWidth / 2) + (ist.polarwidth / 2);
    let circumference = 2 * halfCircumference;
    let diameter = circumference / Math.PI;

    /* Subtract one since the height is defined as the distance between the top of the outer stem
    and the bottom of the inner stem. */
    return diameter - 1;
  }

  /**
   * @param {Stem} st 
   * @param {StrictLayoutDrawingProps} drawingProps The drawing properties of the layout.
   * 
   * @returns {number} The height of the triangle loop of a given stem
   *  that has multiple stems in its loop.
   */
  static _heightMultipleBranches(st, drawingProps) {
    let it = st.loopIterator();
    let urFirst = it.next().value;
    let next = it.next();
    let urLast = null;

    while (!next.done) {
      urLast = it.next().value;
      next = it.next();
    }

    let greater = Math.max(urFirst.length(), urLast.length());
    let platformLength = TriangleLoop.platformLength(st);
    let height = (greater ** 2 - ((platformLength - st.width) / 2) ** 2) ** 0.5;

    // should not be greater than Math.PI / 2
    let maxAngle = Math.min(
      Math.PI / 2,
      Math.abs(drawingProps.maxTriangleLoopAngle) / 2
    );

    // should not be too small either
    maxAngle = Math.max(maxAngle, Math.PI / 16);
    
    let minHeight = Math.cos(maxAngle) * (((platformLength - st.width) / 2) / Math.sin(maxAngle));

    return Math.max(height, minHeight);
  }

  /**
   * Recursively sets the coordinates and angles of stems inner to a given stem.
   * 
   * @param {Stem} st 
   * @param {StrictLayoutDrawingProps} drawingProps The drawing properties of the layout.
   * @param {Array<StrictLayoutBaseProps>} baseProps The base properties of the layout.
   */
  static setInnerCoordinatesAndAngles(st, drawingProps, baseProps) {
    if (!st.hasHairpinLoop()) {
      let x = st.xTopCenter;
      let y = st.yTopCenter;

      let height = TriangleLoop.height(st, drawingProps);
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
        ist.xBottomLeft = x;
        ist.yBottomLeft = y;
        ist.angle = st.angle;
        StemLayout.setInnerCoordinatesAndAngles(ist, drawingProps, baseProps);

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
   * @param {Array<StrictLayoutBaseProps} baseProps The base properties of the layout.
   * 
   * @returns {Array<VirtualBaseCoordinates>} The base coordinates of all positions in the given unpaired region.
   */
  static traverseUnpairedRegion53(ur, baseProps) {
    let coordinates = [];
    let x = ur.baseCoordinatesBounding5().xLeft;
    let y = ur.baseCoordinatesBounding5().yTop;
    let angle = ur.boundingStem5.angle + (Math.PI / 2);

    for (let p = ur.boundingPosition5 + 1; p < ur.boundingPosition3; p++) {
      angle += baseProps[p - 2].flatOutermostLoopAngle3;
      let d = 1 + Math.max(0, baseProps[p - 2].stretch3);
      x += d * Math.cos(angle);
      y += d * Math.sin(angle);
      coordinates.push(new VirtualBaseCoordinates(x, y));
    }

    return coordinates;
  }

  /**
   * Traverses the given unpaired region 3' to 5', using the coordinates and angle of the 3' bounding stem
   * of the unpaired region as a starting point.
   * 
   * @param {UnpairedRegion} ur 
   * @param {Array<StrictLayoutBaseProps} baseProps The base properties of the layout.
   * 
   * @returns {Array<VirtualBaseCoordinates>} The base coordinates of all positions in the given unpaired region.
   */
  static traverseUnpairedRegion35(ur, baseProps) {
    let coordinates = new Array(ur.size);
    let x = ur.baseCoordinatesBounding3().xLeft;
    let y = ur.baseCoordinatesBounding3().yTop;
    let angle = ur.boundingStem3.angle - (Math.PI / 2);

    for (let p = ur.boundingPosition3 - 1; p > ur.boundingPosition5; p--) {
      angle -= baseProps[p - 1].flatOutermostLoopAngle3;
      let d = 1 + Math.max(0, baseProps[p - 1].stretch3);
      x += d * Math.cos(angle);
      y += d * Math.sin(angle);
      coordinates[p - ur.boundingPosition5 - 1] = new VirtualBaseCoordinates(x, y);
    }

    return coordinates;
  }

  /**
   * Sets the coordinates and angle of the 3' bounding stem of the given unpaired region
   * based on the coordinates and angle of the 5' bounding stem of the unpaired region.
   * 
   * @param {UnpairedRegion} ur 
   * @param {Array<StrictLayoutBaseProps} baseProps The base properties of the layout.
   */
  static setNextCoordinatesAndAngle53(ur, baseProps) {
    let coordinates = FlatOutermostLoop.traverseUnpairedRegion53(ur);
    let x;
    let y;
    let angle;

    if (coordinates.length === 0) {
      x = ur.baseCoordinatesBounding5().xLeft;
      y = ur.baseCoordinatesBounding5().yBottom;
    } else {
      x = coordinates[ur.size - 1].xLeft;
      y = coordinates[ur.size - 1].yBottom;
    }

    if (coordinates.length === 0) {
      angle = ur.boundingStem5.angle + (Math.PI / 2)
        + baseProps[ur.boundingPosition5 - 1].flatOutermostLoopAngle3;
    } else if (coordinates.length === 1) {
      angle = ur.baseCoordinatesBounding5().angleBetweenCenters(coordinates[0])
        + baseProps[ur.boundingPosition5].flatOutermostLoopAngle3;
    } else {
      angle = coordinates[ur.size - 2].angleBetweenCenters(coordinates[ur.size - 1])
        + baseProps[ur.boundingPosition3 - 2].flatOutermostLoopAngle3;
    }

    let d = 1
      + Math.max(0, baseProps[ur.boundingPosition3 - 2].stretch3)
      + (ur.boundingStem3.width / 2);
    
    x += d * Math.cos(angle);
    y += d * Math.sin(angle);

    ur.boundingStem3.xBottomCenter = x;
    ur.boundingStem3.yBottomCenter = y;
    ur.boundingStem3.angle = angle - (Math.PI / 2);
  }

  /**
   * Sets the coordinates and angles for all stems in the layout.
   * 
   * @param {Stem} outermostStem The outermost stem of the layout.
   * @param {StrictLayoutDrawingProps} drawingProps The drawing properties of the layout.
   * @param {Array<StrictLayoutBaseProps>} baseProps The base properties of the layout.
   */
  static setCoordinatesAndAngles(outermostStem, drawingProps, baseProps) {
    let it = outermostStem.loopIterator();
    
    // skip the first unpaired region
    it.next();

    let next = it.next();
    let ur;

    if (!next.done) {
      let st = next.value;
      st.xBottomCenter = 0;
      st.yBottomCenter = 0;
      st.angle = drawingProps.rotation - (Math.PI / 2);
      StemLayout.setInnerCoordinatesAndAngles(st, drawingProps, baseProps);

      ur = it.next().value;
      next = it.next();
    }

    while (!next.done) {
      FlatOutermostLoop.setNextCoordinatesAndAngle53(ur, baseProps);
      StemLayout.setInnerCoordinatesAndAngles(ur.boundingStem3, drawingProps, baseProps);
      
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
   * @param {StrictLayoutDrawingProps} drawingProps The drawing properties of the layout.
   * @param {Array<StrictLayoutBaseProps>} baseProps The base properties of the layout.
   * 
   * @throws {Error} If the loop of the outermost stem is not flat or round.
   */
  static setCoordinatesAndAngles(outermostStem, drawingProps, baseProps) {
    if (drawingProps.flatOutermostLoop) {
      FlatOutermostLoop.setCoordinatesAndAngles(outermostStem, drawingProps, baseProps);
    } else if (outermostStem.hasRoundLoop()) {
      RoundLoop.setCoordinatesAndAngles(outermostStem, drawingProps, baseProps);
    } else {
      throw new Error("The loop of the outermost stem must be either flat or round.");
    }
  }

  /**
   * Recursively sets the coordinates and angles for stems inner to the given stem.
   * 
   * @param {Stem} st 
   * @param {StrictLayoutDrawingProps} drawingProps The drawing properties of the layout.
   * @param {Array<StrictLayoutBaseProps>} baseProps The base properties of the layout.
   * 
   * @throws {Error} If the loop of the stem is not round or triangular.
   */
  static setInnerCoordinatesAndAngles(st, drawingProps, baseProps) {
    if (st.hasRoundLoop()) {
      RoundLoop.setInnerCoordinatesAndAngles(st, drawingProps, baseProps);
    } else if (st.hasTriangleLoop()) {
      TriangleLoop.setInnerCoordinatesAndAngles(st, drawingProps, baseProps);
    } else {
      throw new Error("Stem has an unrecognized loop shape.");
    }
  }
}

export {
  RoundLoop,
  TriangleLoop,
  FlatOutermostLoop,
  StemLayout
}
