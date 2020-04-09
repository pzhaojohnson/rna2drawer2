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
  static _applyMostRecentProps(seq, svg) {
    let props = Sequence.mostRecentProps();
    seq.setNumberingAnchor(props.numberingAnchor, svg);
    seq.setNumberingIncrement(props.numberingIncrement, svg);
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
    if (cs5 === null && cs3 === null) {
      return Math.PI / 2;
    } else if (cs5 === null) {
      return Sequence._angleBetweenBaseCenters(cs, cs3) + (Math.PI / 2);
    } else if (cs3 === null) {
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
      xCenter: Base.xCenterFromSavedState(sb, svg),
      yCenter: Base.yCenterFromSavedState(sb, svg),
    };
    
    let cs5 = null;
    let cs3 = null;

    if (p > 1) {
      let sb5 = savedState.bases[p - 2];
      
      cs5 = {
        xCenter: Base.xCenterFromSavedState(sb5, svg),
        yCenter: Base.yCenterFromSavedState(sb5, svg),
      };
    }

    if (p < savedState.bases.length) {
      let sb3 = savedState.bases[p];

      cs3 = {
        xCenter: Base.xCenterFromSavedState(sb3, svg),
        yCenter: Base.yCenterFromSavedState(sb3, svg),
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
    
    if (cs5 === null || cs3 === null) {
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
    seq.setNumberingOffset(savedState.numberingOffset, svg);
    seq.setNumberingAnchor(savedState.numberingAnchor, svg);
    seq.setNumberingIncrement(savedState.numberingIncrement, svg);

    for (let p = 1; p <= savedState.bases.length; p++) {
      let b = Base.fromSavedState(
        savedState.bases[p - 1],
        svg,
        Sequence._clockwiseNormalAngleAtPositionFromSavedState(p, savedState, svg),
      );

      seq.appendBase(b, svg);
    }

    Sequence._copyPropsToMostRecent(seq);
    return seq;
  }

  /**
   * @param {SVG.Doc} svg 
   * @param {string} id 
   * @param {string} letters 
   * 
   * @returns {Sequence} 
   */
  static createOutOfView(svg, id, letters) {
    let seq = new Sequence(id);
    
    for (let i = 0; i < letters.length; i++) {
      let c = letters.charAt(i);
      seq.appendBase(Base.createOutOfView(svg, c));
    }

    Sequence._applyMostRecentProps(seq, svg);
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

  /**
   * @param {SVG.Doc} svg 
   */
  _updateBaseNumberings(svg) {
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
          svg,
          p + this.numberingOffset,
          this.outerNormalAngleAtPosition(p)
        );
      }
    }

    for (let p = anchor + increment; p <= this.length; p += increment) {
      if (p > 0) {
        let b = this.getBaseAtPosition(p);
        
        b.addNumbering(
          svg,
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
   * @param {number} no 
   * @param {SVG.Doc} svg 
   * 
   * @throws {Error} If the given numbering offset is not an integer.
   */
  setNumberingOffset(no, svg) {
    if (!isFinite(no) || Math.floor(no) !== no) {
      throw new Error('Numbering offset must be an integer.');
    }

    this._numberingOffset = no;
    this._updateBaseNumberings(svg);
  }

  /**
   * @returns {number} 
   */
  get numberingAnchor() {
    return this._numberingAnchor;
  }

  /**
   * @param {number} na 
   * @param {SVG.Doc} svg 
   * 
   * @throws {Error} If the given numbering anchor is not an integer.
   */
  setNumberingAnchor(na, svg) {
    if (!isFinite(na) || Math.floor(na) !== na) {
      throw new Error('Numbering anchor must be an integer.');
    }

    this._numberingAnchor = na;
    this._updateBaseNumberings(svg);
    Sequence._mostRecentProps.numberingAnchor = na;
  }

  /**
   * @returns {number} 
   */
  get numberingIncrement() {
    return this._numberingIncrement;
  }

  /**
   * @param {number} ni 
   * @param {SVG.Doc} svg 
   * 
   * @throws {Error} If the given numbering increment is not an integer.
   * @throws {Error} If the given numbering increment is not positive.
   */
  setNumberingIncrement(ni, svg) {
    if (!isFinite(ni) || Math.floor(ni) !== ni) {
      throw new Error('Numbering increment must be an integer.');
    } else if (ni < 1) {
      throw new Error('Numbering increment must be positive.');
    }

    this._numberingIncrement = ni;
    this._updateBaseNumberings(svg);
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
  containsBase(b) {
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
   * @param {Base} b 
   * @param {SVG.Doc} svg 
   * 
   * @throws {Error} If the given base is already in this sequence.
   */
  appendBase(b, svg) {
    if (this.containsBase(b)) {
      throw new Error('Base is already in this sequence.');
    }

    this._bases.push(b);
    this._updateBaseNumberings(svg);
  }

  /**
   * If the position is one plus the length of this sequence, the base will
   * be appended to the end of this sequence.
   * 
   * @param {Base} b 
   * @param {number} p 
   * @param {SVG.Doc} svg 
   * 
   * @throws {Error} If the given base is already in this sequence.
   * @throws {Error} If the given position is out of range.
   */
  insertBaseAtPosition(b, p, svg) {
    if (this.containsBase(b)) {
      throw new Error('Base is already in this sequence.');
    } else if (this.positionOutOfRange(p) && p !== this.length + 1) {
      throw new Error('Position is out of range.');
    }

    if (p === this.length + 1) {
      this.appendBase(b);
    } else if (this.positionInRange(p)) {
      this._bases.splice(p - 1, 0, b);
    }

    this._updateBaseNumberings(svg);
  }

  /**
   * Has no effect if the given position is out of range.
   * 
   * @param {number} p 
   * @param {SVG.Doc} svg 
   */
  removeBaseAtPosition(p, svg) {
    if (this.positionInRange(p)) {
      let b = this.getBaseAtPosition(p);
      b.remove();
      this._bases.splice(p - 1, 1);
    }

    this._updateBaseNumberings(svg);
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
