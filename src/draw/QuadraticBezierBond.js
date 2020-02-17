import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';

class QuadraticBezierBond {

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
    this._setTopPaddingBrackets();
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
  _setTopPaddingBrackets() {
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
   * @returns {number} The length of the overhangs of bracket 1.
   */
  get overhangLengthBracket1() {
    let segments = this._bracket1.array();
    let m = segments[0];
    let l = segments[1];
    return distanceBetween(m[1], m[2], l[1], l[2]);
  }

  /**
   * @returns {number} The distance between the top of bracket 2 and the centers
   *  of the bases of side 2.
   */
  get topPaddingBracket2() {
    return this._topPaddingBracket2;
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
}

export default QuadraticBezierBond;
