import MultiBond from './MultiBond';

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
    this._validatePaths();
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

  _validatePaths() {
    this._validateCurve();
  }

  /**
   * Validates the curve of this quadratic bezier bond.
   * 
   * @throws {Error} If the curve is not composed of a proper M segment followed by a proper Q segment.
   */
  _validateCurve() {
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
   * @param {Array<Base>} side 
   */
  _validateBracket(bracket, side) {}

  get xCurveEnd1() {
    let m = this._curve.array()[0];
    return m[1];
  }

  get yCurveEnd1() {
    let m = this._curve.array()[0];
    return m[2];
  }

  get xCurveEnd2() {
    let q = this._curve.array()[1];
    return q[3];
  }

  get yCurveEnd2() {
    let q = this._curve.array()[1];
    return q[4];
  }

  get xCurveControlPoint() {
    let q = this._curve.array()[1];
    return q[1];
  }

  get yCurveControlPoint() {
    let q = this._curve.array()[1];
    return q[2];
  }
}

export default QuadraticBezierBond;
