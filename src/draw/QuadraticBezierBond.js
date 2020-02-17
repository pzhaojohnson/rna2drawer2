import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';

class QuadraticBezierBond {

  /**
   * @callback QuadraticBezierBond~baseCounterClockwiseNormalAngleCallback 
   * @param {Base} base 
   * 
   * @returns {number} The counterclockwise normal angle to the curve created by the given base
   *  and its neighboring bases.
   */

  /**
   * @param {Array<Base>} side The side that the bracket is attached to.
   * @param {number} topPadding The top padding of the bracket.
   * @param {number} overhangPadding The overhang padding of the bracket.
   * @param {number} overhangLength The overhang length of the bracket.
   * @param {QuadraticBezierBond~baseCounterClockwiseNormalAngleCallback} baseCounterClockwiseNormalAngleCallback 
   * 
   * @returns {string} The d attribute of the path of the bracket.
   */
  static _dBracket(side, topPadding, overhangPadding, overhangLength, baseCounterClockwiseNormalAngleCallback) {
    let bFirst = side[0];
    let angle = baseCounterClockwiseNormalAngleCallback(bFirst);
    let x = bFirst.xCenter + (topPadding * Math.cos(angle));
    let y = bFirst.yCenter + (topPadding * Math.sin(angle));
    d = 'L ' + x + ' ' + y + ' ';

    angle -= Math.PI / 2;
    x += overhangPadding * Math.cos(angle);
    y += overhangPadding * Math.sin(angle);
    d = 'L ' + x + ' ' + y + ' ' + d;

    angle -= Math.PI / 2;
    x += overhangLength * Math.cos(angle);
    y += overhangLength * Math.sin(angle);
    d = 'M ' + x + ' ' + y + ' ' + d;

    side.slice(1, side.length - 1).forEach(b => {
      angle = baseCounterClockwiseNormalAngleCallback(b);
      x = b.xCenter + (topPadding * Math.cos(angle));
      y = b.yCenter + (topPadding * Math.sin(angle));
      d += 'L ' + x + ' ' + y + ' ';
    });

    let bLast = side[side.length - 1];
    angle = baseCounterClockwiseNormalAngleCallback(bLast);
    x = bLast.xCenter + (topPadding * Math.cos(angle));
    y = bLast.yCenter + (topPadding * Math.sin(angle));
    d += 'L ' + x + ' ' + y + ' ';

    angle += Math.PI / 2;
    x += overhangPadding * Math.cos(angle);
    y += overhangPadding * Math.sin(angle);
    d += 'L ' + x + ' ' + y + ' ';

    angle += Math.PI / 2;
    x += overhangLength * Math.cos(angle);
    y += overhangLength * Math.sin(angle);
    d += 'L ' + x + ' ' + y;
    
    return d;
  }

  /**
   * @typedef {Object} QuadraticBezierBond~BracketMidPoint 
   * @property {number} x The X coordinate of the midpoint.
   * @property {number} y The Y coordinate of the midpoint.
   */

  /**
   * @param {SVG.Path} bracket A bracket of a quadratic bezier bond.
   * 
   * @returns {QuadraticBezierBond~BracketMidPoint} The midpoint of the bracket.
   */
  static _bracketMidpoint(bracket) {
    let segments = bracket.array();
    let lefti;
    let righti;

    // even number of segments
    if (segments.length % 2 === 0) {
      lefti = (segments.length / 2) - 1;
      righti = segments.length / 2;
    } else {
      lefti = Math.floor(segments.length / 2);
      righti = Math.floor(segments.length / 2);
    }

    let left = segments[lefti];
    let right = segments[righti];
    
    return {
      x: (left[1] + right[1]) / 2,
      y: (left[2] + right[2]) / 2,
    };
  }

  /**
   * @param {SVG.Path} bracket1 Bracket 1 of the quadratic bezier bond.
   * @param {SVG.Path} bracket2 Bracket 2 of the quadratic bezier bond.
   * @param {number} height The height of the curve.
   * @param {number} angle The height of the curve.
   * 
   * @returns {string} The d attribute of the path of the curve of the quadratic bezier bond.
   */
  static _dCurve(bracket1, bracket2, height, angle) {
    let bmp1 = QuadraticBezierBond._bracketMidpoint(bracket1);
    let bmx1 = bmp1.x;
    let bmy1 = bmp1.y;
    let d = 'M ' + bmx1 + ' ' + bmy1 + ' ';

    let bmp2 = QuadraticBezierBond._bracketMidpoint(bracket2);
    let bmx2 = bmp2.x;
    let bmy2 = bmp2.y;

    let emx = (bmx1 + bmx2) / 2;
    let emy = (bmy1 + bmy2) / 2;
    let endsAngle = angleBetween(bmx1, bmy1, bmx2, bmy2);
    let a = endsAngle + angle;

    let xControl = emx + (height * Math.cos(a));
    let yControl = emy + (height * Math.sin(a));

    d += 'Q ' + xControl + ' ' + yControl + ' ' + bmx2 + ' ' + bmy2;

    return d;
  }

  /**
   * This constructor cannot verify if the bases stored in the side1 and side2
   * arguments are consecutive and in ascending order by position.
   * 
   * @param {SVG.Path} curve The quadratic bezier curve.
   * @param {SVG.Path} bracket1 The bracket over side 1.
   * @param {SVG.Path} bracket2 The bracket over side 2.
   * @param {Array<Base>} side1 The consecutive bases of one side of the bond in ascending order by position.
   * @param {Array<Base>} side2 The consecutive bases of the other side of the bond in ascending order by position.
   */
  constructor(curve, bracket1, bracket2, side1, side2) {
    
    // make shallow copies
    this._side1 = [...side1];
    this._side2 = [...side2];
    this._validateSides();

    this._curve = curve;
    this._bracket1 = bracket1;
    this._bracket2 = bracket2;
    this._validateCurve();
    this._validateBracket(this._bracket1, this._side1);
    this._validateBracket(this._bracket2, this._side2);
    this._setBracketTopPaddings();
  }
  
  /**
   * @throws {Error} If either side of this bond contains no bases.
   */
  _validateSides() {
    if (this._side1.length === 0) {
      throw new Error('Side 1 cannot be empty.');
    }

    if (this._side2.length === 0) {
      throw new Error('Side 2 cannot be empty.');
    }
  }

  /**
   * Validates the curve of this quadratic bezier bond.
   * 
   * @throws {Error} If the ID of the curve has not been set to non-empty string.
   * @throws {Error} If the curve is not composed of a proper M segment followed by a proper Q segment.
   */
  _validateCurve() {
    if (typeof(this._curve.id()) !== 'string' || this._curve.id().length === 0) {
      throw new Error('The ID of the curve must be set to a non-empty string.');
    }

    let segments = this._curve.array();

    if (segments.length !== 2) {
      throw new Error('The path of the curve should only have two segments.');
    }

    let m = segments[0];
    
    let mSegmentInvalid = m[0] !== 'M'
      || m.length !== 3
      || (typeof(m[1]) !== 'number' || !isFinite(m[1]))
      || (typeof(m[2]) !== 'number' || !isFinite(m[2]));

    if (mSegmentInvalid) {
      throw new Error('The M segment of the curve is invalid.');
    }

    let q = segments[1];

    let qSegmentInvalid = q[0] !== 'Q'
      || q.length !== 5
      || (typeof(q[1]) !== 'number' || !isFinite(q[1]))
      || (typeof(q[2]) !== 'number' || !isFinite(q[2]))
      || (typeof(q[3]) !== 'number' || !isFinite(q[3]))
      || (typeof(q[4]) !== 'number' || !isFinite(q[4]));

    if (qSegmentInvalid) {
      throw new Error('The Q segment of the curve is invalid.');
    }
  }

  /**
   * Validates the bracket with respect to its side.
   * 
   * @param {SVG.Path} bracket 
   * @param {Array<Base>} side The side that the bracket belongs to.
   * 
   * @throws {Error} If the ID of the bracket has not been set to a non-empty string.
   * @throws {Error} If the first segment of the bracket is not a valid M segment.
   * @throws {Error} If any trailing segments are not valid L segments.
   * @throws {Error} If the total number of segments is not four plus the number of bases in the side.
   */
  _validateBracket(bracket, side) {
    if (typeof(bracket.id()) !== 'string' || bracket.id().length === 0) {
      throw new Error('The ID of the bracket must be set to a non-empty string.');
    }

    let segments = bracket.array();

    if (segments.length !== side.length + 4) {
      throw new Error('The bracket does not have the correct number of segments.');
    }

    let m = segments[0];

    let mSegmentInvalid = m[0] !== 'M'
      || m.length != 3
      || (typeof(m[1]) !== 'number' || !isFinite(m[1]))
      || (typeof(m[2]) !== 'number' || !isFinite(m[2]));

    if (mSegmentInvalid) {
      throw new Error('The M segment of the bracket is invalid.');
    }

    segments.slice(1).forEach(l => {
      let lSegmentInvalid = l[0] !== 'L'
        || (typeof(l[1]) !== 'number' || !isFinite(l[1]))
        || (typeof(l[2]) !== 'number' || !isFinite(l[2]));

      if (lSegmentInvalid) {
        throw new Error('The bracket contains an invalid L segment.');
      }
    });
  }

  /**
   * @returns {number} The X coordinate of the end of the curve attached to side 1.
   */
  get xCurveEnd1() {
    let m = this._curve.array()[0];
    return m[1];
  }

  /**
   * @returns {number} The Y coordinate of the end of the curve attached to side 1.
   */
  get yCurveEnd1() {
    let m = this._curve.array()[0];
    return m[2];
  }

  /**
   * @returns {number} The X coordinate of the end of the curve attached to side 2.
   */
  get xCurveEnd2() {
    let q = this._curve.array()[1];
    return q[3];
  }

  /**
   * @returns {number} The Y coordinate of the end of the curve attached to side 2.
   */
  get yCurveEnd2() {
    let q = this._curve.array()[1];
    return q[4];
  }

  /**
   * @returns {number} The X coordinate of the control point of the curve.
   */
  get xCurveControlPoint() {
    let q = this._curve.array()[1];
    return q[1];
  }

  /**
   * @returns {number} The Y coordinate of the control point of the curve.
   */
  get yCurveControlPoint() {
    let q = this._curve.array()[1];
    return q[2];
  }

  /**
   * @returns {number} The distance between the control point of the curve and the midpoint of the line
   *  connecting the two ends of the curve.
   */
  get curveHeight() {
    let midx = (this.xCurveEnd2 + this.xCurveEnd1) / 2;
    let midy = (this.yCurveEnd2 + this.yCurveEnd1) / 2;
    return distanceBetween(midx, midy, this.xCurveControlPoint, this.yCurveControlPoint);
  }

  /**
   * The angle of the control point of the curve is calculated as the angle from the midpoint
   * of the line connecting the two ends of the curve to the control point of the curve.
   * 
   * The angle between the two ends of the curve is calculated as the angle from end 1 of the
   * curve to end 2.
   * 
   * The returned difference is normalized to be greater than or equal to zero and less
   * than 2 * Math.PI.
   * 
   * @returns {number} The difference between the angle of the control point of the curve
   *  and the angle between the two ends of the curve.
   */
  get curveAngle() {
    let endsAngle = angleBetween(this.xCurveEnd1, this.yCurveEnd1, this.xCurveEnd2, this.yCurveEnd2);

    let midx = (this.xCurveEnd2 + this.xCurveEnd1) / 2;
    let midy = (this.yCurveEnd2 + this.yCurveEnd1) / 2;
    let controlAngle = angleBetween(midx, midy, this.xCurveControlPoint, this.yCurveControlPoint);
    
    controlAngle = normalizeAngle(controlAngle, endsAngle);
    return controlAngle - endsAngle;
  }

  /**
   * Sets the _topPaddingBracket1 and _topPaddingBracket2 properties based on the current
   * positions of the brackets and bases of the sides.
   * 
   * The _topPaddingBracket1 and _topPaddingBracket2 properties are necessary for the
   * reposition method to work.
   */
  _setBracketTopPaddings() {
    let b1 = this._side1[0];
    let l1 = this._bracket1.array()[2];
    this._topPaddingBracket1 = distanceBetween(b1.xCenter, b1.yCenter, l1[1], l1[2]);

    let b2 = this._side2[0];
    let l2 = this._bracket2.array()[2];
    this._topPaddingBracket2 = distanceBetween(b2.xCenter, b2.yCenter, l2[1], l2[2]);
  }

  /**
   * @returns {number} The distance between the top of bracket 1 and the centers
   *  of the bases of side 1.
   */
  get topPaddingBracket1() {
    return this._topPaddingBracket1;
  }

  /**
   * @returns {number} The distance between the top of bracket 2 and the centers
   *  of the bases of side 2.
   */
  get topPaddingBracket2() {
    return this._topPaddingBracket2;
  }

  /**
   * @returns {number} The distance between the overhangs of bracket 1 and the centers
   *  of the bases they are hanging over.
   */
  get overhangPaddingBracket1() {
    let segments = this._bracket1.array();
    let l1 = segments[1];
    let l2 = segments[2];
    return distanceBetween(l1[1], l1[2], l2[1], l2[2]);
  }

  /**
   * @returns {number} The distance between the overhangs of bracket 2 and the centers
   *  of the bases they are hanging over.
   */
  get overhangPaddingBracket2() {
    let segments = this._bracket2.array();
    let l1 = segments[1];
    let l2 = segments[2];
    return distanceBetween(l1[1], l1[2], l2[1], l2[2]);
  }

  /**
   * @returns {number} The length of the overhangs of bracket 1.
   */
  get overhangLengthBracket1() {
    let segments = this._bracket1.array();
    let m = segments[0];
    let l = segments[1];
    return distanceBetween(m[1], m[2], l[1], l[2]);
  }

  /**
   * @returns {number} The length of the overhangs of bracket 2.
   */
  get overhangLengthBracket2() {
    let segments = this._bracket2.array();
    let m = segments[0];
    let l = segments[1];
    return distanceBetween(m[1], m[2], l[1], l[2]);
  }

  /**
   * @typedef {Object} QuadraticBezierBond~BracketMidPoint 
   * @property {number} x The X coordinate of the midpoint.
   * @property {number} y The Y coordinate of the midpoint.
   */

  /**
   * @param {SVG.Path} bracket One of the brackets of this bond.
   * 
   * @returns {QuadraticBezierBond~BracketMidPoint} The midpoint of the bracket.
   */
  _bracketMidpoint(bracket) {
    let segments = bracket.array();
    let lefti;
    let righti;

    // even number of segments
    if (segments.length % 2 === 0) {
      lefti = (segments.length / 2) - 1;
      righti = segments.length / 2;
    } else {
      lefti = Math.floor(segments.length / 2);
      righti = Math.floor(segments.length / 2);
    }

    let left = segments[lefti];
    let right = segments[righti];
    
    return {
      x: (left[1] + right[1]) / 2,
      y: (left[2] + right[2]) / 2,
    };
  }

  /**
   * @returns {number} The X coordinate of the midpoint of bracket 1.
   */
  get xMiddleBracket1() {
    return this._bracketMidpoint(this._bracket1).x;
  }

  /**
   * @returns {number} The Y coordinate of the midpoint of bracket 1.
   */
  get yMiddleBracket1() {
    return this._bracketMidpoint(this._bracket1).y;
  }

  /**
   * @returns {number} The X coordinate of the midpoint of bracket 2.
   */
  get xMiddleBracket2() {
    return this._bracketMidpoint(this._bracket2).x;
  }

  /**
   * @returns {number} The Y coordinate of the midpoint of bracket 2.
   */
  get yMiddleBracket2() {
    return this._bracketMidpoint(this._bracket2).y;
  }

  /**
   * Repositions the curve and brackets of this quadratic bezier bond
   * based on the current positions of the bases of its sides.
   * 
   * @param {QuadraticBezierBond~baseCounterClockwiseNormalAngleCallback} baseCounterClockwiseNormalAngleCallback 
   */
  reposition(baseCounterClockwiseNormalAngleCallback) {
    this._bracket1.plot(QuadraticBezierBond._dBracket(
      this._side1,
      this._topPaddingBracket1,
      this.overhangPaddingBracket1,
      this.overhangLengthBracket1,
      baseCounterClockwiseNormalAngleCallback,
    ));

    this._bracket2.plot(QuadraticBezierBond._dBracket(
      this._side2,
      this._topPaddingBracket2,
      this.overhangPaddingBracket2,
      this.overhangLengthBracket2,
      baseCounterClockwiseNormalAngleCallback,
    ));

    this._curve.plot(QuadraticBezierBond._dCurve(
      this._bracket1,
      this._bracket2,
      this.curveHeight,
      this.curveAngle,
    ));

    this._setBracketTopPaddings();
  }
}

export default QuadraticBezierBond;
