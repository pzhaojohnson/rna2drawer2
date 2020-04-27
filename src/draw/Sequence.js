import Base from './Base';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';

class Sequence {

  /**
   * @typedef {Object} Sequence~MostRecentProps 
   * @property {number} numberingAnchor 
   * @property {number} numberingIncrement 
   */

  /**
   * @returns {Sequence~MostRecentProps} 
   */
  static mostRecentProps() {
    return { ...Sequence._mostRecentProps };
  }

  /**
   * @param {Sequence} seq 
   */
  static _applyMostRecentProps(seq) {
    let props = Sequence.mostRecentProps();
    seq.setNumberingAnchor(props.numberingAnchor);
    seq.setNumberingIncrement(props.numberingIncrement);
  }

  /**
   * @param {Sequence} seq 
   */
  static _copyPropsToMostRecent(seq) {
    Sequence._mostRecentProps.numberingAnchor = seq.numberingAnchor;
    Sequence._mostRecentProps.numberingIncrement = seq.numberingIncrement;
  }

  /**
   * @typedef {Object} Sequence~BaseCoordinates 
   * @property {number} xCenter 
   * @property {number} yCenter 
   */

  /**
   * @param {Sequence~BaseCoordinates} cs1 
   * @param {Sequence~BaseCoordinates} cs2 
   * 
   * @returns {number} 
   */
  static _angleBetweenBaseCenters(cs1, cs2) {
    return angleBetween(cs1.xCenter, cs1.yCenter, cs2.xCenter, cs2.yCenter);
  }

  /**
   * @param {Sequence~BaseCoordinates} cs 
   * @param {Sequence~BaseCoordinates|null} cs5 
   * @param {Sequence~BaseCoordinates|null} cs3 
   * 
   * @returns {number} 
   */
  static _clockwiseNormalAngleOfBase(cs, cs5, cs3) {
    if (!cs5 && !cs3) {
      return Math.PI / 2;
    } else if (!cs5) {
      return Sequence._angleBetweenBaseCenters(cs, cs3) + (Math.PI / 2);
    } else if (!cs3) {
      return Sequence._angleBetweenBaseCenters(cs, cs5) - (Math.PI / 2);
    } else {
      let a5 = Sequence._angleBetweenBaseCenters(cs, cs5);
      let a3 = Sequence._angleBetweenBaseCenters(cs, cs3);
      a5 = normalizeAngle(a5, a3);
      return (a5 + a3) / 2;
    }
  }

  /**
   * @param {number} p 
   * @param {Sequence~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * 
   * @returns {number} 
   */
  static _clockwiseNormalAngleAtPositionFromSavedState(p, savedState, svg) {
    let sb = savedState.bases[p - 1];
    let cs = {
      xCenter: Base.xFromSavedState(sb, svg),
      yCenter: Base.yFromSavedState(sb, svg),
    };
    let cs5 = null;
    let cs3 = null;
    if (p > 1) {
      let sb5 = savedState.bases[p - 2];
      cs5 = {
        xCenter: Base.xFromSavedState(sb5, svg),
        yCenter: Base.yFromSavedState(sb5, svg),
      };
    }
    if (p < savedState.bases.length) {
      let sb3 = savedState.bases[p];
      cs3 = {
        xCenter: Base.xFromSavedState(sb3, svg),
        yCenter: Base.yFromSavedState(sb3, svg),
      };
    }
    return Sequence._clockwiseNormalAngleOfBase(cs, cs5, cs3);
  }

  /**
   * @param {Sequence~BaseCoordinates} cs 
   * @param {Sequence~BaseCoordinates|null} cs5 
   * @param {Sequence~BaseCoordinates|null} cs3 
   * 
   * @returns {number} 
   */
  static _innerNormalAngleOfBase(cs, cs5, cs3) {
    let cna = Sequence._clockwiseNormalAngleOfBase(cs, cs5, cs3);
    if (!cs5 || !cs3) {
      return cna;
    } else {
      let a5 = Sequence._angleBetweenBaseCenters(cs, cs5);
      let a3 = Sequence._angleBetweenBaseCenters(cs, cs3);
      a5 = normalizeAngle(a5, a3);
      if (a5 - a3 < Math.PI) {
        return (a5 + a3) / 2;
      } else {
        a3 = normalizeAngle(a3, a5);
        return (a5 + a3) / 2;
      }
    }
  }

  /**
   * @param {Sequence~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * 
   * @returns {Sequence} 
   */
  static fromSavedState(savedState, svg) {
    let seq = new Sequence(savedState.id);
    seq.setNumberingOffset(savedState.numberingOffset);
    seq.setNumberingAnchor(savedState.numberingAnchor);
    seq.setNumberingIncrement(savedState.numberingIncrement);
    for (let p = 1; p <= savedState.bases.length; p++) {
      let b = Base.fromSavedState(
        savedState.bases[p - 1],
        svg,
        Sequence._clockwiseNormalAngleAtPositionFromSavedState(p, savedState, svg),
      );
      seq.appendBase(b);
    }
    Sequence._copyPropsToMostRecent(seq);
    return seq;
  }

  /**
   * @param {SVG.Doc} svg 
   * @param {string} id 
   * @param {string} characters 
   * 
   * @returns {Sequence} 
   */
  static createOutOfView(svg, id, characters) {
    let seq = new Sequence(id);
    let bases = [];
    for (let i = 0; i < characters.length; i++) {
      bases.push(Base.createOutOfView(svg, characters.charAt(i)));
    }
    seq.appendBases(bases);
    Sequence._applyMostRecentProps(seq);
    return seq;
  }

  /**
   * @param {string} id 
   */
  constructor(id) {
    this._id = id;
    this._bases = [];
    this._numberingOffset = 0;
    this._numberingAnchor = 0;
    this._numberingIncrement = 20;
  }

  /**
   * @returns {string} The ID of this sequence.
   */
  get id() {
    return this._id;
  }

  _updateBaseNumberings() {
    this._bases.forEach(b => {
      if (b.hasNumbering()) {
        b.removeNumbering();
      }
    });
    let anchor = this.numberingAnchor;
    let increment = this.numberingIncrement;
    for (let p = anchor; p > 0; p -= increment) {
      if (p <= this.length) {
        let b = this.getBaseAtPosition(p);
        b.addNumbering(
          p + this.numberingOffset,
          this.outerNormalAngleAtPosition(p)
        );
      }
    }

    for (let p = anchor + increment; p <= this.length; p += increment) {
      if (p > 0) {
        let b = this.getBaseAtPosition(p);
        b.addNumbering(
          p + this.numberingOffset,
          this.outerNormalAngleAtPosition(p)
        );
      }
    }
  }

  /**
   * @returns {number} 
   */
  get numberingOffset() {
    return this._numberingOffset;
  }

  /**
   * Has no effect if the given number is not an integer.
   * 
   * @param {number} no 
   */
  setNumberingOffset(no) {
    if (!isFinite(no) || Math.floor(no) !== no) {
      return;
    }
    this._numberingOffset = no;
    this._updateBaseNumberings();
  }

  /**
   * @returns {number} 
   */
  get numberingAnchor() {
    return this._numberingAnchor;
  }

  /**
   * Has no effect if the given number is not an integer.
   * 
   * @param {number} na 
   */
  setNumberingAnchor(na) {
    if (!isFinite(na) || Math.floor(na) !== na) {
      return;
    }
    this._numberingAnchor = na;
    this._updateBaseNumberings();
    Sequence._mostRecentProps.numberingAnchor = na;
  }

  /**
   * @returns {number} 
   */
  get numberingIncrement() {
    return this._numberingIncrement;
  }

  /**
   * Has no effect if the given number is not an integer or is not positive.
   * 
   * @param {number} ni 
   */
  setNumberingIncrement(ni) {
    if (!isFinite(ni) || Math.floor(ni) !== ni) {
      return;
    } else if (ni < 1) {
      return;
    }
    this._numberingIncrement = ni;
    this._updateBaseNumberings();
    Sequence._mostRecentProps.numberingIncrement = ni;
  }

  /**
   * @returns {number} The length of this sequence.
   */
  get length() {
    return this._bases.length;
  }

  /**
   * @param {number} p 
   * 
   * @returns {number} 
   */
  offsetPosition(p) {
    return p + this.numberingOffset;
  }

  /**
   * @param {number} op 
   * 
   * @returns {number} 
   */
  reversePositionOffset(op) {
    return op - this.numberingOffset;
  }

  /**
   * @param {number} p 
   * 
   * @returns {boolean} 
   */
  positionOutOfRange(p) {
    return p < 1 || p > this.length;
  }

  /**
   * @param {number} p 
   * 
   * @returns {boolean} 
   */
  positionInRange(p) {
    return !this.positionOutOfRange(p);
  }

  /**
   * @param {number} op 
   * 
   * @returns {boolean} 
   */
  offsetPositionOutOfRange(op) {
    let p = this.reversePositionOffset(op);
    return this.positionOutOfRange(p);
  }

  /**
   * @param {number} op 
   * 
   * @returns {boolean} 
   */
  offsetPositionInRange(op) {
    let p = this.reversePositionOffset(op);
    return this.positionInRange(p);
  }

  /**
   * Returns null if the position is out of the range of this sequence.
   * 
   * @param {number} p 
   * 
   * @returns {Base|null} 
   */
  getBaseAtPosition(p) {
    if (this.positionOutOfRange(p)) {
      return null;
    } else {
      return this._bases[p - 1];
    }
  }

  /**
   * Returns null if the offset position is out of the offset range of this sequence.
   * 
   * @param {number} op 
   * 
   * @returns {Base|null} 
   */
  getBaseAtOffsetPosition(op) {
    let p = this.reversePositionOffset(op);
    return this.getBaseAtPosition(p);
  }

  /**
   * Returns null if no base in this sequence has the given ID.
   * 
   * @param {string} id 
   * 
   * @returns {Base|null} 
   */
  getBaseById(id) {
    for (let p = 1; p <= this.length; p++) {
      let b = this.getBaseAtPosition(p);
      if (b.id === id) {
        return b;
      }
    }
    return null;
  }

  /**
   * The returned bases will include the bases at the given
   * 5' and 3' most positions.
   * 
   * The bases are returned in ascending order.
   * 
   * @param {number} p5 
   * @param {number} p3 
   * 
   * @returns {Array<Base>} 
   */
  getBasesInRange(p5, p3) {
    let bases = [];
    for (let p = p5; p <= p3; p++) {
      bases.push(this.getBaseAtPosition(p));
    }
    return bases;
  }

  /**
   * @param {callback} cb 
   */
  forEachBase(cb) {
    this._bases.forEach(b => cb(b));
  }

  /**
   * @returns {Array<string>} 
   */
  baseIds() {
    let ids = [];
    this.forEachBase(b => ids.push(b.id));
    return ids;
  }

  /**
   * Returns zero if the given base is not in this sequence.
   * 
   * @param {Base} b 
   * 
   * @returns {number} 
   */
  positionOfBase(b) {
    for (let p = 1; p <= this.length; p++) {
      if (this.getBaseAtPosition(p).id === b.id) {
        return p;
      }
    }
    return 0;
  }

  /**
   * Returns the minimum offset position of this sequence minus one if
   * the given base is not in this sequence.
   * 
   * @param {Base} b 
   * 
   * @returns {number} 
   */
  offsetPositionOfBase(b) {
    let p = this.positionOfBase(b);
    return this.offsetPosition(p);
  }

  /**
   * @param {Base} b 
   * 
   * @returns {boolean} 
   */
  contains(b) {
    return this.positionOfBase(b) !== 0;
  }

  /**
   * Returns null if the position is out of the range of this sequence.
   * 
   * @param {number} p 
   * 
   * @returns {number|null} 
   */
  clockwiseNormalAngleAtPosition(p) {
    if (this.positionOutOfRange(p)) {
      return null;
    } else {
      let b = this.getBaseAtPosition(p);
      let cs = { xCenter: b.xCenter, yCenter: b.yCenter };
      let cs5 = null;
      let cs3 = null;
      if (p > 1) {
        let b5 = this.getBaseAtPosition(p - 1);
        cs5 = { xCenter: b5.xCenter, yCenter: b5.yCenter };
      }
      if (p < this.length) {
        let b3 = this.getBaseAtPosition(p + 1);
        cs3 = { xCenter: b3.xCenter, yCenter: b3.yCenter };
      }
      return Sequence._clockwiseNormalAngleOfBase(cs, cs5, cs3);
    }
  }

  counterClockwiseNormalAngleAtPosition(p) {
    if (this.positionOutOfRange(p)) {
      return null;
    } else {
      return Math.PI + this.clockwiseNormalAngleAtPosition(p);
    }
  }

  /**
   * Returns null if the given position is out of range.
   * 
   * @param {number} p 
   * 
   * @returns {number|null} 
   */
  innerNormalAngleAtPosition(p) {
    if (this.positionOutOfRange(p)) {
      return null;
    } else {
      let b = this.getBaseAtPosition(p);
      let cs = { xCenter: b.xCenter, yCenter: b.yCenter };
      let cs5 = null;
      let cs3 = null;
      if (p > 1) {
        let b5 = this.getBaseAtPosition(p - 1);
        cs5 = { xCenter: b5.xCenter, yCenter: b5.yCenter };
      }
      if (p < this.length) {
        let b3 = this.getBaseAtPosition(p + 1);
        cs3 = { xCenter: b3.xCenter, yCenter: b3.yCenter };
      }
      return Sequence._innerNormalAngleOfBase(cs, cs5, cs3);
    }
  }

  /**
   * Returns null if the given position is out of range.
   * 
   * @param {number} p 
   * 
   * @returns {number|null} 
   */
  outerNormalAngleAtPosition(p) {
    if (this.positionOutOfRange(p)) {
      return null;
    } else {
      return Math.PI + this.innerNormalAngleAtPosition(p);
    }
  }

  /**
   * Appends the given base to the end of this sequence.
   * 
   * Has no effect if the given base is already in this sequence.
   * 
   * @param {Base} b 
   */
  appendBase(b) {
    if (this.contains(b)) {
      return;
    }
    this._bases.push(b);
    this._updateBaseNumberings();
  }

  /**
   * This method has no effect if this sequence already contains
   * one of the given bases.
   * 
   * @param {Array<Base>} bs 
   */
  appendBases(bs) {
    let alreadyContains = false;
    bs.forEach(b => {
      if (this.contains(b)) {
        alreadyContains = true;
      }
    });
    if (alreadyContains) {
      return;
    }
    bs.forEach(b => {
      this._bases.push(b);
    });
    this._updateBaseNumberings();
  }

  /**
   * If the position is one plus the length of this sequence, the base will
   * be appended to the end of this sequence.
   * 
   * Has no effect if the given base is already in this sequence or if the
   * given position is out of range.
   * 
   * @param {Base} b 
   * @param {number} p 
   */
  insertBaseAtPosition(b, p) {
    if (this.contains(b)) {
      return;
    } else if (this.positionOutOfRange(p) && p !== this.length + 1) {
      return;
    }
    if (p === this.length + 1) {
      this.appendBase(b);
    } else if (this.positionInRange(p)) {
      this._bases.splice(p - 1, 0, b);
    }
    this._updateBaseNumberings();
  }

  /**
   * Has no effect if the given position is out of range.
   * 
   * @param {number} p 
   */
  removeBaseAtPosition(p) {
    if (this.positionInRange(p)) {
      let b = this.getBaseAtPosition(p);
      b.remove();
      this._bases.splice(p - 1, 1);
    }
    this._updateBaseNumberings();
  }

  remove() {
    for (let i = 0; i < this._bases.length; i++) {
      this._bases[i].remove();
    }
    this._bases = [];
  }

  /**
   * @typedef {Object} Sequence~SavableState 
   * @property {string} className 
   * @property {string} id 
   * @property {Array<Base~SavableState>} bases 
   * @property {number} numberingOffset 
   * @property {number} numberingAnchor 
   * @property {number} numberingIncrement 
   */

  /**
   * @returns {Sequence~SavableState} 
   */
  savableState() {
    let savableState = {
      className: 'Sequence',
      id: this.id,
      bases: [],
      numberingOffset: this.numberingOffset,
      numberingAnchor: this.numberingAnchor,
      numberingIncrement: this.numberingIncrement,
    };
    this._bases.forEach(
      b => savableState.bases.push(b.savableState())
    );
    return savableState;
  }
}

Sequence._mostRecentProps = {
  numberingAnchor: 0,
  numberingIncrement: 20,
};

export default Sequence;
