import Base from './Base';
import normalizeAngle from './normalizeAngle';

class Sequence {

  /**
   * Draws a sequence in a horizontal line on an SVG document.
   * 
   * @param {SVG.Doc} svg The SVG document to draw the sequence on.
   * @param {string} id The ID of the sequence.
   * @param {string} seqString The sequence to draw.
   * @param {number} xFirst The X coordinate of the center of the first base.
   * @param {number} yFirst The Y coordinate of the center of the first base.
   * @param {number} spacing The distance between neighboring bases.
   * 
   * @returns {Sequence} The newly created sequence.
   */
  static createHorizontalLine(svg, id, seqString, xFirst, yFirst, spacing) {
    let seq = new Sequence(id);
    let x = xFirst;

    for (let i = 0; i < seqString.length; i++) {
      seq.appendBase(Base.create(
        svg,
        seqString.charAt(i),
        x,
        yFirst
      ));

      x += spacing;
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
