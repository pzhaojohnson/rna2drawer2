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
    this._storeBracketTopPaddings();
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
   * Shifts theX and Y coordinates of the control point of the curve by the given amounts.
   * 
   * @param {number} xShift 
   * @param {number} yShift 
   * @param {QuadraticBezierBond~baseCounterClockwiseNormalAngleCallback} baseCounterClockwiseNormalAngleCallback 
   */
  shiftCurveControlPoint(xShift, yShift, baseCounterClockwiseNormalAngleCallback) {
    let xControl = this.xCurveControlPoint + xShift;
    let yControl = this.yCurveControlPoint + yShift;

    let emx = (this.xCurveEnd1 + this.xCurveEnd2) / 2;
    let emy = (this.yCurveEnd1 + this.yCurveEnd2) / 2;

    let height = distanceBetween(emx, emy, xControl, yControl);

    let endsAngle = angleBetween(this.xCurveEnd1, this.yCurveEnd1, this.xCurveEnd2, this.yCurveEnd2);
    let a = angleBetween(emx, emy, xControl, yControl);
    angle = normalizeAngle(a, endsAngle) - endsAngle;

    this.setCurveHeight(height, baseCounterClockwiseNormalAngleCallback);
    this.setCurveAngle(angle, baseCounterClockwiseNormalAngleCallback);
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
   * @param {number} h The new curve height.
   * @param {QuadraticBezierBond~baseCounterClockwiseNormalAngleCallback} baseCounterClockwiseNormalAngleCallback 
   */
  setCurveHeight(h, baseCounterClockwiseNormalAngleCallback) {
    let curveProps = this._curveProps();
    curveProps.height = h;
    
    this._reposition(
      curveProps,
      this._bracketProps1(),
      this._bracketProps2(),
      baseCounterClockwiseNormalAngleCallback,
    );
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
   * @param {number} a The new curve angle.
   * @param {QuadraticBezierBond~baseCounterClockwiseNormalAngleCallback} baseCounterClockwiseNormalAngleCallback 
   */
  setCurveAngle(a, baseCounterClockwiseNormalAngleCallback) {
    let curveProps = this._curveProps();
    curveProps.angle = a;

    this._reposition(
      curveProps,
      this._bracketProps1(),
      this._bracketProps2(),
      baseCounterClockwiseNormalAngleCallback,
    );
  }

  /**
   * @typedef {Object} QuadraticBezierBond~CurveProps 
   * @property {number} height 
   * @property {number} angle 
   */

  /**
   * @returns {QuadraticBezierBond~CurveProps} The current curve properties.
   */
  _curveProps() {
    return {
      height: this.curveHeight,
      angle: this.curveAngle,
    };
  }

  /**
   * Sets the _topPaddingBracket1 and _topPaddingBracket2 properties based on the current
   * positions of the brackets and the bases of their sides.
   * 
   * The _topPaddingBracket1 and _topPaddingBracket2 properties are necessary for the
   * reposition method to work.
   */
  _storeBracketTopPaddings() {
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
   * @param {number} tp The top padding for bracket 1.
   * @param {QuadraticBezierBond~baseCounterClockwiseNormalAngleCallback} baseCounterClockwiseNormalAngleCallback 
   */
  setTopPaddingBracket1(tp, baseCounterClockwiseNormalAngleCallback) {
    let bracketProps1 = this._bracketProps1();
    bracketProps1.topPadding = tp;

    this._reposition(
      this._curveProps(),
      bracketProps1,
      this._bracketProps2(),
      baseCounterClockwiseNormalAngleCallback,
    );
  }

  /**
   * @returns {number} The distance between the top of bracket 2 and the centers
   *  of the bases of side 2.
   */
  get topPaddingBracket2() {
    return this._topPaddingBracket2;
  }

  /**
   * @param {number} tp The new top padding for bracket 2.
   * @param {QuadraticBezierBond~baseCounterClockwiseNormalAngleCallback} baseCounterClockwiseNormalAngleCallback 
   */
  setTopPaddingBracket2(tp, baseCounterClockwiseNormalAngleCallback) {
    let bracketProps2 = this._bracketProps2();
    bracketProps2.topPadding = tp;

    this._reposition(
      this._curveProps(),
      this._bracketProps1(),
      bracketProps2,
      baseCounterClockwiseNormalAngleCallback,
    );
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
   * @param {number} ohp The new overhang padding for bracket 1.
   * @param {QuadraticBezierBond~baseCounterClockwiseNormalAngleCallback} baseCounterClockwiseNormalAngleCallback 
   */
  setOverhangPaddingBracket1(ohp, baseCounterClockwiseNormalAngleCallback) {
    let bracketProps1 = this._bracketProps1();
    bracketProps1.overhangPadding = ohp;

    this._reposition(
      this._curveProps(),
      bracketProps1,
      this._bracketProps2(),
      baseCounterClockwiseNormalAngleCallback,
    );
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
   * @param {number} ohp The new overhang padding for bracket 2.
   * @param {QuadraticBezierBond~baseCounterClockwiseNormalAngleCallback} baseCounterClockwiseNormalAngleCallback 
   */
  setOverhangPaddingBracket2(ohp, baseCounterClockwiseNormalAngleCallback) {
    let bracketProps2 = this._bracketProps2();
    bracketProps2.overhangPadding = ohp;

    this._reposition(
      this._curveProps(),
      this._bracketProps1(),
      bracketProps2,
      baseCounterClockwiseNormalAngleCallback,
    );
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
   * @param {number} ohl The new overhang length for bracket 1.
   * @param {QuadraticBezierBond~baseCounterClockwiseNormalAngleCallback} baseCounterClockwiseNormalAngleCallback 
   */
  setOverhangLengthBracket1(ohl, baseCounterClockwiseNormalAngleCallback) {
    let bracketProps1 = this._bracketProps1();
    bracketProps1.overhangLength = ohl;

    this._reposition(
      this._curveProps(),
      bracketProps1,
      this._bracketProps2(),
      baseCounterClockwiseNormalAngleCallback,
    );
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
   * @param {number} ohl The new overhang length for bracket 2.
   * @param {QuadraticBezierBond~baseCounterClockwiseNormalAngleCallback} baseCounterClockwiseNormalAngleCallback 
   */
  setOverhangLengthBracket2(ohl, baseCounterClockwiseNormalAngleCallback) {
    let bracketProps2 = this._bracketProps2();
    bracketProps2.overhangLength = ohl;

    this._reposition(
      this._curveProps(),
      this._bracketProps1(),
      bracketProps2,
      baseCounterClockwiseNormalAngleCallback,
    );
  }

  /**
   * @returns {number} The opacity of bracket1.
   */
  get opacityBracket1() {
    return this._bracket1.attr('opacity');
  }

  /**
   * @param {number} o 
   */
  set opacityBracket1(o) {
    this._bracket1.attr({ 'opacity': o });
  }

  /**
   * @returns {number} The opacity of bracket 2.
   */
  get opacityBracket2() {
    return this._bracket2.attr('opacity');
  }

  /**
   * @param {number} o 
   */
  set opacityBracket2(o) {
    this._bracket2.attr({ 'opacity': o });
  }

  /**
   * @typedef {Object} QuadraticBezierBond~BracketProps 
   * @property {number} topPadding 
   * @property {number} overhangPadding 
   * @property {number} overhangLength 
   * @property {number} opacity 
   */

  /**
   * @returns {QuadraticBezierBond~BracketProps} The current properties of bracket 1.
   */
  _bracketProps1() {
    return {
      topPadding: this.topPaddingBracket1,
      overhangPadding: this.overhangPaddingBracket1,
      overhangLength: this.overhangLengthBracket1,
      opacity: this.opacityBracket1,
    };
  }

  /**
   * @returns {QuadraticBezierBond~BracketProps} The current properties of bracket 2.
   */
  _bracketProps2() {
    return {
      topPadding: this.topPaddingBracket2,
      overhangPadding: this.overhangPaddingBracket2,
      overhangLength: this.overhangLengthBracket2,
      opacity: this.opacityBracket2,
    };
  }

  /**
   * Repositions the curve and brackets of this quadratic bezier bond based on
   * the current positions of the bases of its sides and the previous properties
   * of its curve and brackets.
   * 
   * @param {QuadraticBezierBond~baseCounterClockwiseNormalAngleCallback} baseCounterClockwiseNormalAngleCallback 
   */
  reposition(baseCounterClockwiseNormalAngleCallback) {
    this._reposition(
      this._curveProps(),
      this._bracketProps1(),
      this._bracketProps2(),
      baseCounterClockwiseNormalAngleCallback,
    );
  }

  /**
   * Repositions the curve and brackets of this quadratic bezier curve based on
   * the current positions of the bases of its sides and the given properties for
   * its curve and brackets.
   * 
   * @param {QuadraticBezierBond~CurveProps} curveProps 
   * @param {QuadraticBezierBond~BracketProps} bracketProps1 
   * @param {QuadraticBezierBond~BracketProps} bracketProps2 
   * @param {QuadraticBezierBond~baseCounterClockwiseNormalAngleCallback} baseCounterClockwiseNormalAngleCallback 
   */
  _reposition(curveProps, bracketProps1, bracketProps2, baseCounterClockwiseNormalAngleCallback) {
    this._bracket1.plot(QuadraticBezierBond._dBracket(
      this._side1,
      bracketProps1.topPadding,
      bracketProps1.overhangPadding,
      bracketProps1.overhangLength,
      baseCounterClockwiseNormalAngleCallback,
    ));

    this._bracket2.plot(QuadraticBezierBond._dBracket(
      this._side2,
      bracketProps2.topPadding,
      bracketProps2.overhangPadding,
      bracketProps2.overhangLength,
      baseCounterClockwiseNormalAngleCallback,
    ));

    this._curve.plot(QuadraticBezierBond._dCurve(
      this._bracket1,
      this._bracket2,
      curveProps.height,
      curveProps.angle,
    ));

    this._storeBracketTopPaddings();
  }

  /**
   * @returns {string} The stroke color of this quadratic bezier bond.
   */
  get stroke() {
    return this._curve.attr('stroke');
  }

  /**
   * @param {string} s 
   */
  set stroke(s) {
    this._curve.attr({ 'stroke': s });
    this._bracket1.attr({ 'stroke': s });
    this._bracket2.attr({ 'stroke': s });
  }

  /**
   * @returns {number} The stroke width of this quadratic bezier bond.
   */
  get strokeWidth() {
    return this._curve.attr('stroke-width');
  }

  /**
   * @param {number} sw 
   */
  set strokeWidth(sw) {
    this._curve.attr({ 'stroke-width': sw });
    this._bracket1.attr({ 'stroke-width': sw });
    this._bracket2.attr({ 'stroke-width': sw });
  }
}

export default QuadraticBezierBond;
