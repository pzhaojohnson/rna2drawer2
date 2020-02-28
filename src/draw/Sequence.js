import Base from './Base';
import normalizeAngle from './normalizeAngle';

class Sequence {

  /**
   * @param {SVG.Doc} svg 
   * @param {string} id 
   * @param {string} letters 
   */
  static createOutOfView(svg, id, letters) {
    let seq = new Sequence(id);

    for (let i = 0; i < letters.length; i++) {
      let c = letters.charAt(i);
      seq.appendBase(Base.createOutOfView(svg, c));
    }

    return seq;
  }

  constructor(id) {
    this._id = id;
    this._bases = [];
  }

  /**
   * @returns {string} The ID of this sequence.
   */
  get id() {
    return this._id;
  }

  /**
   * @returns {number} The length of this sequence.
   */
  get length() {
    return this._bases.length;
  }

  /**
   * @param {number} p The position of the base in this sequence.
   */
  getBase(p) {
    return this._bases[p - 1];
  }

  /**
   * @param {Base} b 
   * 
   * @returns {number} The position of the given base in this sequence.
   * 
   * @throws {Error} If the given base is not in this sequence.
   */
  basePosition(b) {
    for (let i = 0; i < this.length; i++) {
      if (Object.is(this._bases[i], b)) {
        return i + 1;
      }
    }

    throw new Error('The given base is not in this sequence.');
  }

  /**
   * @param {Base} b 
   * 
   * @returns {number} The angle from the base pointing out of the structure of the drawing.
   */
  baseOutwardAngle(b) {
    let p = this.basePosition(b);

    if (this.length === 1) {
      return Math.PI;
    } else if (p === 1) {
      let nextAngle = b.angleBetweenCenters(this.getBase(2));
      return nextAngle - (Math.PI / 2);
    } else if (p === this.length) {
      let prevAngle = b.angleBetweenCenters(this.getBase(this.length - 1));
      return prevAngle + (Math.PI / 2);
    } else {
      let prevAngle = b.angleBetweenCenters(this.getBase(p - 1));
      let nextAngle = b.angleBetweenCenters(this.getBase(p + 1));
      nextAngle = normalizeAngle(nextAngle, prevAngle);
      return prevAngle + ((nextAngle - prevAngle) / 2);
    }
  }

  /**
   * @param {Base} b 
   * 
   * @returns {number} The angle from the base pointing into the structure of the drawing.
   */
  baseInwardAngle(b) {
    return this.baseOutwardAngle(b) + Math.PI;
  }

  /**
   * Appends the given base to the end of this sequence.
   * 
   * @param {Base} b 
   */
  appendBase(b) {
    this._bases.push(b);
  }
}

export default Sequence;
