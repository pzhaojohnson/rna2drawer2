import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';

class QuadraticBezierBond {

  /**
   * @callback QuadraticBezierBond~getBaseById 
   * @param {string} id 
   * 
   * @returns {Base} 
   */
  
   /**
   * @param {QuadraticBezierBond~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * @param {QuadraticBezierBond~getBaseById} getBaseById 
   * @param {QuadraticBezierBond~getBaseClockwiseNormalAngle} getBaseClockwiseNormalAngle 
   * 
   * @throws {Error} If the saved state is not for a quadratic bezier bond.
   */
  static fromSavedState(savedState, svg, getBaseById, getBaseClockwiseNormalAngle) {
    if (savedState.className !== 'QuadraticBezierBond') {
      throw new Error('Saved state is not for a quadratic bezier bond.');
    }
    
    let curve = svg.findOne('#' + savedState.curve);
    let bracket1 = svg.findOne('#' + savedState.bracket1);
    let bracket2 = svg.findOne('#' + savedState.bracket2);

    let side1 = [];
    savedState.side1.forEach(id => side1.push(getBaseById(id)));

    let side2 = [];
    savedState.side2.forEach(id => side2.push(getBaseById(id)));

    return new QuadraticBezierBond(
      curve,
      bracket1,
      bracket2,
      side1,
      side2,
      getBaseClockwiseNormalAngle
    );
  }

  /**
   * @callback QuadraticBezierBond~getBaseClockwiseNormalAngle 
   * @param {Base} base 
   * 
   * @returns {number} 
   */

  /**
   * @param {Array<Base>} side 
   * @param {QuadraticBezierBond~BracketPositionalProps} positionalProps 
   * @param {QuadraticBezierBond~getBaseClockwiseNormalAngle} getBaseClockwiseNormalAngle 
   * 
   * @returns {string} 
   */
  static _dBracket(side, positionalProps, getBaseClockwiseNormalAngle) {
    let bFirst = side[0];
    let angle = getBaseClockwiseNormalAngle(bFirst);
    let x = bFirst.xCenter + (positionalProps.topPadding * Math.cos(angle));
    let y = bFirst.yCenter + (positionalProps.topPadding * Math.sin(angle));
    let d = 'L ' + x + ' ' + y + ' ';

    angle += Math.PI / 2;
    x += positionalProps.overhangPadding * Math.cos(angle);
    y += positionalProps.overhangPadding * Math.sin(angle);
    d = 'L ' + x + ' ' + y + ' ' + d;

    angle += (positionalProps.topPadding < 0) ? (-Math.PI / 2) : (Math.PI / 2);
    x += positionalProps.overhangLength * Math.cos(angle);
    y += positionalProps.overhangLength * Math.sin(angle);
    d = 'M ' + x + ' ' + y + ' ' + d;

    side.slice(1, side.length).forEach(b => {
      angle = getBaseClockwiseNormalAngle(b);
      x = b.xCenter + (positionalProps.topPadding * Math.cos(angle));
      y = b.yCenter + (positionalProps.topPadding * Math.sin(angle));
      d += 'L ' + x + ' ' + y + ' ';
    });

    let bLast = side[side.length - 1];
    angle = getBaseClockwiseNormalAngle(bLast);
    x = bLast.xCenter + (positionalProps.topPadding * Math.cos(angle));
    y = bLast.yCenter + (positionalProps.topPadding * Math.sin(angle));
    
    angle -= Math.PI / 2;
    x += positionalProps.overhangPadding * Math.cos(angle);
    y += positionalProps.overhangPadding * Math.sin(angle);
    d += 'L ' + x + ' ' + y + ' ';

    angle += (positionalProps.topPadding < 0) ? (Math.PI / 2) : (-Math.PI / 2);
    x += positionalProps.overhangLength * Math.cos(angle);
    y += positionalProps.overhangLength * Math.sin(angle);
    d += 'L ' + x + ' ' + y;
    
    return d;
  }

  /**
   * @typedef {Object} QuadraticBezierBond~BracketMidPoint 
   * @property {number} x 
   * @property {number} y 
   */

  /**
   * @param {SVG.Path} bracket 
   * 
   * @returns {QuadraticBezierBond~BracketMidPoint} 
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
   * @param {SVG.Path} bracket1 
   * @param {SVG.Path} bracket2 
   * @param {QuadraticBezierBond~CurvePositionalProps} positionalProps 
   * 
   * @returns {string} 
   */
  static _dCurve(bracket1, bracket2, positionalProps) {
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
    let a = endsAngle + positionalProps.angle;

    let xControl = emx + (positionalProps.height * Math.cos(a));
    let yControl = emy + (positionalProps.height * Math.sin(a));

    d += 'Q ' + xControl + ' ' + yControl + ' ' + bmx2 + ' ' + bmy2;

    return d;
  }

  /**
   * @param {SVG.Doc} svg 
   * @param {Array<Base>} side1 
   * @param {Array<Base>} side2 
   * 
   * @returns {QuadraticBezierBond} 
   */
  static create(svg, side1, side2, getBaseClockwiseNormalAngle) {
    let bracketPositionalProps = {
      topPadding: 10,
      overhangPadding: 8,
      overhangLength: 10,
    };

    let bracket1 = svg.path(QuadraticBezierBond._dBracket(
      side1,
      bracketPositionalProps,
      getBaseClockwiseNormalAngle,
    ));

    let bracket2 = svg.path(QuadraticBezierBond._dBracket(
      side2,
      bracketPositionalProps,
      getBaseClockwiseNormalAngle,
    ));

    let curvePositionalProps = {
      height: 100,
      angle: 3 * Math.PI / 2,
    };

    let curve = svg.path(QuadraticBezierBond._dCurve(
      bracket1,
      bracket2,
      curvePositionalProps,
    ));

    let qbb = new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2, getBaseClockwiseNormalAngle);
    qbb.applyDefaults(getBaseClockwiseNormalAngle);
    return qbb;
  }

  /**
   * The bases of a side should be consecutive and in ascending order, though
   * this cannot be verified by a quadratic bezier bond.
   * 
   * @param {SVG.Path} curve 
   * @param {SVG.Path} bracket1 
   * @param {SVG.Path} bracket2 
   * @param {Array<Base>} side1 
   * @param {Array<Base>} side2 
   * @param {QuadraticBezierBond~getBaseClockwiseNormalAngle} getBaseClockwiseNormalAngle 
   */
  constructor(curve, bracket1, bracket2, side1, side2, getBaseClockwiseNormalAngle) {
    
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
    this._storeBracketTopPaddings(getBaseClockwiseNormalAngle);
  }
  
  /**
   * @throws {Error} If either side of this bond has no bases.
   */
  _validateSides() {
    if (this._side1.length === 0) {
      throw new Error('Side 1 has no bases.');
    }

    if (this._side2.length === 0) {
      throw new Error('Side 2 has no bases.');
    }
  }

  /**
   * @throws {Error} If the ID of the curve is not a string or is an empty string.
   * @throws {Error} If the curve is not composed of a M segment followed by a Q segment.
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
   * @param {SVG.Path} bracket 
   * @param {Array<Base>} side 
   * 
   * @throws {Error} If the ID of the bracket is not a string or is an empty string.
   * @throws {Error} If the total number of segments is not four plus the number of bases in the side.
   * @throws {Error} If the first segment of the bracket is not an M segment.
   * @throws {Error} If any trailing segments are not L segments.
   */
  _validateBracket(bracket, side) {
    if (typeof(bracket.id()) !== 'string' || bracket.id().length === 0) {
      throw new Error('Invalid bracket ID.');
    }

    let segments = bracket.array();

    if (segments.length !== side.length + 4) {
      throw new Error('Incorrect number of segments.');
    }

    let m = segments[0];

    let mSegmentInvalid = m[0] !== 'M'
      || m.length != 3
      || (typeof(m[1]) !== 'number' || !isFinite(m[1]))
      || (typeof(m[2]) !== 'number' || !isFinite(m[2]));

    if (mSegmentInvalid) {
      throw new Error('Invalid M segment.');
    }

    segments.slice(1).forEach(l => {
      let lSegmentInvalid = l[0] !== 'L'
        || (typeof(l[1]) !== 'number' || !isFinite(l[1]))
        || (typeof(l[2]) !== 'number' || !isFinite(l[2]));

      if (lSegmentInvalid) {
        throw new Error('Invalid L segment.');
      }
    });
  }

  /**
   * @returns {number} 
   */
  get xCurveEnd1() {
    let m = this._curve.array()[0];
    return m[1];
  }

  /**
   * @returns {number} 
   */
  get yCurveEnd1() {
    let m = this._curve.array()[0];
    return m[2];
  }

  /**
   * @returns {number} 
   */
  get xCurveEnd2() {
    let q = this._curve.array()[1];
    return q[3];
  }

  /**
   * @returns {number} 
   */
  get yCurveEnd2() {
    let q = this._curve.array()[1];
    return q[4];
  }

  /**
   * @returns {number} 
   */
  get xCurveControlPoint() {
    let q = this._curve.array()[1];
    return q[1];
  }

  /**
   * @returns {number} 
   */
  get yCurveControlPoint() {
    let q = this._curve.array()[1];
    return q[2];
  }

  /**
   * @param {number} xShift 
   * @param {number} yShift 
   * @param {QuadraticBezierBond~getBaseClockwiseNormalAngle} getBaseClockwiseNormalAngle 
   */
  shiftCurveControlPoint(xShift, yShift, getBaseClockwiseNormalAngle) {
    let xControl = this.xCurveControlPoint + xShift;
    let yControl = this.yCurveControlPoint + yShift;

    let emx = (this.xCurveEnd1 + this.xCurveEnd2) / 2;
    let emy = (this.yCurveEnd1 + this.yCurveEnd2) / 2;

    let height = distanceBetween(emx, emy, xControl, yControl);

    let endsAngle = angleBetween(this.xCurveEnd1, this.yCurveEnd1, this.xCurveEnd2, this.yCurveEnd2);
    let a = angleBetween(emx, emy, xControl, yControl);
    let angle = normalizeAngle(a, endsAngle) - endsAngle;

    let curvePositionalProps = this._curvePositionalProps();
    curvePositionalProps.height = height;
    curvePositionalProps.angle = angle;

    this._reposition(
      curvePositionalProps,
      this._bracketPositionalProps1(),
      this._bracketPositionalProps2(),
      getBaseClockwiseNormalAngle,
    );
  }

  /**
   * @returns {number} The distance between the control point of the curve and the midpoint
   *  between the two ends of the curve.
   */
  get curveHeight() {
    let midx = (this.xCurveEnd2 + this.xCurveEnd1) / 2;
    let midy = (this.yCurveEnd2 + this.yCurveEnd1) / 2;
    return distanceBetween(midx, midy, this.xCurveControlPoint, this.yCurveControlPoint);
  }

  /**
   * The angle of the control point of the curve is the angle from the midpoint between
   * the two ends of the curve to the control point of the curve.
   * 
   * The angle between the two ends of the curve is calculated as the angle from end 1
   * to end 2 of the curve.
   * 
   * The returned angle is normalized to be greater than or equal to zero and less
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
   * @typedef {Object} QuadraticBezierBond~CurvePositionalProps 
   * @property {number} height 
   * @property {number} angle 
   */

  /**
   * @returns {QuadraticBezierBond~CurvePositionalProps} 
   */
  _curvePositionalProps() {
    return {
      height: this.curveHeight,
      angle: this.curveAngle,
    };
  }

  /**
   * Sets the _topPaddingBracket1 and _topPaddingBracket2 properties.
   * 
   * @param {QuadraticBezierBond~getBaseClockwiseNormalAngle} getBaseClockwiseNormalAngle 
   */
  _storeBracketTopPaddings(getBaseClockwiseNormalAngle) {
    function topPadding(bracket, side) {
      let l = bracket.array()[2];
      let b = side[0];
      let d = distanceBetween(b.xCenter, b.yCenter, l[1], l[2]);
      let a = angleBetween(b.xCenter, b.yCenter, l[1], l[2]);
      let na = getBaseClockwiseNormalAngle(b);
      let angleDiff = normalizeAngle(a, na) - na;

      // if not for imprecision in floating point arithmetic, angleDiff would either be zero or Math.PI
      if (angleDiff > Math.PI / 2 && angleDiff < 3 * Math.PI / 2) {
        d *= -1;
      }
      
      return d;
    }

    this._topPaddingBracket1 = topPadding(this._bracket1, this._side1);
    this._topPaddingBracket2 = topPadding(this._bracket2, this._side2);
  }

  /**
   * @returns {number} 
   */
  get topPaddingBracket1() {
    return this._topPaddingBracket1;
  }

  /**
   * @param {number} tp 
   * @param {QuadraticBezierBond~getBaseClockwiseNormalAngle} getBaseClockwiseNormalAngle 
   */
  setTopPaddingBracket1(tp, getBaseClockwiseNormalAngle) {
    let bracketProps1 = this._bracketPositionalProps1();
    bracketProps1.topPadding = tp;

    this._reposition(
      this._curvePositionalProps(),
      bracketProps1,
      this._bracketPositionalProps2(),
      getBaseClockwiseNormalAngle,
    );
  }

  /**
   * @returns {number} 
   */
  get topPaddingBracket2() {
    return this._topPaddingBracket2;
  }

  /**
   * @param {number} tp 
   * @param {QuadraticBezierBond~getBaseClockwiseNormalAngle} getBaseClockwiseNormalAngle 
   */
  setTopPaddingBracket2(tp, getBaseClockwiseNormalAngle) {
    let bracketProps2 = this._bracketPositionalProps2();
    bracketProps2.topPadding = tp;

    this._reposition(
      this._curvePositionalProps(),
      this._bracketPositionalProps1(),
      bracketProps2,
      getBaseClockwiseNormalAngle,
    );
  }

  /**
   * @returns {number} 
   */
  get overhangPaddingBracket1() {
    let segments = this._bracket1.array();
    let l1 = segments[1];
    let l2 = segments[2];
    return distanceBetween(l1[1], l1[2], l2[1], l2[2]);
  }

  /**
   * @param {number} ohp 
   * @param {QuadraticBezierBond~getBaseClockwiseNormalAngle} getBaseClockwiseNormalAngle 
   */
  setOverhangPaddingBracket1(ohp, getBaseClockwiseNormalAngle) {
    let bracketProps1 = this._bracketPositionalProps1();
    bracketProps1.overhangPadding = ohp;

    this._reposition(
      this._curvePositionalProps(),
      bracketProps1,
      this._bracketPositionalProps2(),
      getBaseClockwiseNormalAngle,
    );
  }

  /**
   * @returns {number} 
   */
  get overhangPaddingBracket2() {
    let segments = this._bracket2.array();
    let l1 = segments[1];
    let l2 = segments[2];
    return distanceBetween(l1[1], l1[2], l2[1], l2[2]);
  }

  /**
   * @param {number} ohp 
   * @param {QuadraticBezierBond~getBaseClockwiseNormalAngle} getBaseClockwiseNormalAngle 
   */
  setOverhangPaddingBracket2(ohp, getBaseClockwiseNormalAngle) {
    let bracketProps2 = this._bracketPositionalProps2();
    bracketProps2.overhangPadding = ohp;

    this._reposition(
      this._curvePositionalProps(),
      this._bracketPositionalProps1(),
      bracketProps2,
      getBaseClockwiseNormalAngle,
    );
  }

  /**
   * @returns {number} 
   */
  get overhangLengthBracket1() {
    let segments = this._bracket1.array();
    let m = segments[0];
    let l = segments[1];
    return distanceBetween(m[1], m[2], l[1], l[2]);
  }

  /**
   * @param {number} ohl 
   * @param {QuadraticBezierBond~getBaseClockwiseNormalAngle} getBaseClockwiseNormalAngle 
   */
  setOverhangLengthBracket1(ohl, getBaseClockwiseNormalAngle) {
    let bracketProps1 = this._bracketPositionalProps1();
    bracketProps1.overhangLength = ohl;

    this._reposition(
      this._curvePositionalProps(),
      bracketProps1,
      this._bracketPositionalProps2(),
      getBaseClockwiseNormalAngle,
    );
  }

  /**
   * @returns {number} 
   */
  get overhangLengthBracket2() {
    let segments = this._bracket2.array();
    let m = segments[0];
    let l = segments[1];
    return distanceBetween(m[1], m[2], l[1], l[2]);
  }

  /**
   * @param {number} ohl 
   * @param {QuadraticBezierBond~getBaseClockwiseNormalAngle} getBaseClockwiseNormalAngle 
   */
  setOverhangLengthBracket2(ohl, getBaseClockwiseNormalAngle) {
    let bracketProps2 = this._bracketPositionalProps2();
    bracketProps2.overhangLength = ohl;

    this._reposition(
      this._curvePositionalProps(),
      this._bracketPositionalProps1(),
      bracketProps2,
      getBaseClockwiseNormalAngle,
    );
  }

  /**
   * @typedef {Object} QuadraticBezierBond~BracketPositionalProps 
   * @property {number} topPadding 
   * @property {number} overhangPadding 
   * @property {number} overhangLength 
   */

  /**
   * @returns {QuadraticBezierBond~BracketPositionalProps} 
   */
  _bracketPositionalProps1() {
    return {
      topPadding: this.topPaddingBracket1,
      overhangPadding: this.overhangPaddingBracket1,
      overhangLength: this.overhangLengthBracket1,
    };
  }

  /**
   * @returns {QuadraticBezierBond~BracketPositionalProps} 
   */
  _bracketPositionalProps2() {
    return {
      topPadding: this.topPaddingBracket2,
      overhangPadding: this.overhangPaddingBracket2,
      overhangLength: this.overhangLengthBracket2,
    };
  }

  /**
   * Repositions the curve and brackets of this quadratic bezier bond based on the
   * current positions of the bases of its sides.
   * 
   * @param {QuadraticBezierBond~getBaseClockwiseNormalAngle} getBaseClockwiseNormalAngle 
   */
  reposition(getBaseClockwiseNormalAngle) {
    this._reposition(
      this._curvePositionalProps(),
      this._bracketPositionalProps1(),
      this._bracketPositionalProps2(),
      getBaseClockwiseNormalAngle,
    );
  }

  /**
   * Repositions the curve and brackets of this quadratic bezier curve based on the
   * current positions of the bases of its sides and the given positional properties
   * for its curve and brackets.
   * 
   * @param {QuadraticBezierBond~CurvePositionalProps} curveProps 
   * @param {QuadraticBezierBond~BracketPositionalProps} bracketProps1 
   * @param {QuadraticBezierBond~BracketPositionalProps} bracketProps2 
   * @param {QuadraticBezierBond~getBaseClockwiseNormalAngle} getBaseClockwiseNormalAngle 
   */
  _reposition(curveProps, bracketProps1, bracketProps2, getBaseClockwiseNormalAngle) {
    this._bracket1.plot(QuadraticBezierBond._dBracket(
      this._side1,
      bracketProps1,
      getBaseClockwiseNormalAngle,
    ));

    this._bracket2.plot(QuadraticBezierBond._dBracket(
      this._side2,
      bracketProps2,
      getBaseClockwiseNormalAngle,
    ));

    this._curve.plot(QuadraticBezierBond._dCurve(
      this._bracket1,
      this._bracket2,
      curveProps,
    ));

    this._storeBracketTopPaddings(getBaseClockwiseNormalAngle);
  }

  /**
   * @param {SVG.Element} ele 
   */
  insertBefore(ele) {
    this._curve.insertBefore(ele);
    this._bracket1.insertBefore(ele);
    this._bracket2.insertBefore(ele);
  }

  /**
   * @param {SVG.Element} ele 
   */
  insertAfter(ele) {
    this._curve.insertAfter(ele);
    this._bracket1.insertAfter(ele);
    this._bracket2.insertAfter(ele);
  }

  /**
   * @returns {string} 
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
   * @returns {number} 
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

  /**
   * @returns {string} 
   */
  get curveStrokeDasharray() {
    return this._curve.attr('stroke-dasharray');
  }

  /**
   * @param {string} sd 
   */
  set curveStrokeDasharray(sd) {
    this._curve.attr({ 'stroke-dasharray': sd });
  }

  /**
   * @returns {number} 
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
   * @returns {number} 
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
   * @param {function} cb 
   */
  bindMousedown(cb) {
    this._curve.mousedown(cb);
    this._bracket1.mousedown(cb);
    this._bracket2.mousedown(cb);
  }

  /**
   * @param {function} cb 
   */
  bindDblclick(cb) {
    this._curve.dblclick(cb);
    this._bracket1.dblclick(cb);
    this._bracket2.dblclick(cb);
  }

  /**
   * @returns {string} 
   */
  get cursor() {
    return this._curve.css('cursor');
  }

  /**
   * @param {string} c 
   */
  set cursor(c) {
    this._curve.css({ 'cursor': c });
    this._bracket1.css({ 'cursor': c });
    this._bracket2.css({ 'cursor': c });
  }

  /**
   * @param {QuadraticBezierBond~getBaseClockwiseNormalAngle} getBaseClockwiseNormalAngle 
   */
  applyDefaults(getBaseClockwiseNormalAngle) {
    this.setTopPaddingBracket1(
      QuadraticBezierBond.defaults.topPaddingBracket1,
      getBaseClockwiseNormalAngle
    );

    this.setTopPaddingBracket2(
      QuadraticBezierBond.defaults.topPaddingBracket2,
      getBaseClockwiseNormalAngle
    );
    
    this.setOverhangPaddingBracket1(
      QuadraticBezierBond.defaults.overhangPaddingBracket1,
      getBaseClockwiseNormalAngle
    );
    
    this.setOverhangPaddingBracket2(
      QuadraticBezierBond.defaults.overhangPaddingBracket2,
      getBaseClockwiseNormalAngle
    );
    
    this.setOverhangLengthBracket1(
      QuadraticBezierBond.defaults.overhangLengthBracket1,
      getBaseClockwiseNormalAngle
    );
    
    this.setOverhangLengthBracket2(
      QuadraticBezierBond.defaults.overhangLengthBracket2,
      getBaseClockwiseNormalAngle
    );
    
    this.stroke = QuadraticBezierBond.defaults.stroke;
    this.strokeWidth = QuadraticBezierBond.defaults.strokeWidth;
    this.curveStrokeDasharray = QuadraticBezierBond.defaults.curveStrokeDasharray;
    this.cursor = QuadraticBezierBond.defaults.cursor;
  }

  /**
   * @typedef {Object} QuadraticBezierBond~SavableState 
   * @property {string} className 
   * @property {string} curve 
   * @property {string} bracket1 
   * @property {string} bracket2 
   * @property {Array<string>} side1 
   * @property {Array<string>} side2 
   */

  /**
   * @returns {QuadraticBezierBond~SavableState} 
   */
  savableState() {
    let savableState = {
      className: 'QuadraticBezierBond',
      curve: this._curve.id(),
      bracket1: this._bracket1.id(),
      bracket2: this._bracket2.id(),
      side1: [],
      side2: [],
    };

    this._side1.forEach(
      b => savableState.side1.push(b.id)
    );

    this._side2.forEach(
      b => savableState.side2.push(b.id)
    );

    return savableState;
  }
}

QuadraticBezierBond.defaults = {
  topPaddingBracket1: 6,
  topPaddingBracket2: 6,
  overhangPaddingBracket1: 6,
  overhangPaddingBracket2: 6,
  overhangLengthBracket1: 6,
  overhangLengthBracket2: 6,
  stroke: '#0000FF',
  strokeWidth: 1,
  curveStrokeDasharray: '3 1',
  cursor: 'pointer',
};

export default QuadraticBezierBond;
