import MultiBond from './MultiBond';

class QuadraticBezierBond extends MultiBond {

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
    super(side1, side2);

    this._curve = curve;
    this._bracket1 = bracket1;
    this._bracket2 = bracket2;
    this._validatePaths();
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

    let mSegmentInvalid = m.length !== 3
      || m[0] !== 'M'
      || typeof(m[1]) !== 'number'
      || typeof(m[2]) !== 'number';

    if (mSegmentInvalid) {
      throw new Error('The M segment of the curve is invalid.');
    }

    let q = segments[1];

    let qSegmentInvalid = q.length !== 3
      || q[0] !== 'Q'
      || typeof(q[1]) !== 'number'
      || typeof(q[2]) !== 'number';

    if (qSegmentInvalid) {
      throw new Error('The Q segment of the curve is invalid.');
    }
  }
  
  _validateSides() {
  }
}

export default QuadraticBezierBond;
