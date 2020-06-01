import {
  SequenceInterface,
  SequenceMostRecentProps,
  SequenceSavableState,
} from './SequenceInterface';
import { SvgInterface as Svg } from './SvgInterface';
import Base from './Base';
import { BaseSavableState } from './BaseInterface';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';

interface BaseCoordinates {
  xCenter: number;
  yCenter: number;
}

class Sequence implements SequenceInterface {
  static _mostRecentProps: {
    numberingAnchor: number;
    numberingIncrement: number;
  };

  _id: string;
  _bases: Base[];
  _numberingOffset: number;
  _numberingAnchor: number;
  _numberingIncrement: number;

  _onAddBase: (b: Base) => void;

  static mostRecentProps(): SequenceMostRecentProps {
    return { ...Sequence._mostRecentProps };
  }

  static _applyMostRecentProps(seq: Sequence) {
    let props = Sequence.mostRecentProps();
    seq.setNumberingAnchor(props.numberingAnchor);
    seq.setNumberingIncrement(props.numberingIncrement);
  }

  static _copyPropsToMostRecent(seq: Sequence) {
    Sequence._mostRecentProps.numberingAnchor = seq.numberingAnchor;
    Sequence._mostRecentProps.numberingIncrement = seq.numberingIncrement;
  }

  static _angleBetweenBaseCenters(cs1: BaseCoordinates, cs2: BaseCoordinates): number {
    return angleBetween(cs1.xCenter, cs1.yCenter, cs2.xCenter, cs2.yCenter);
  }

  static _clockwiseNormalAngleOfBase(
    cs: BaseCoordinates,
    cs5?: BaseCoordinates,
    cs3?: BaseCoordinates,
  ): number {
    if (cs5 && cs3) {
      let a5 = Sequence._angleBetweenBaseCenters(cs, cs5);
      let a3 = Sequence._angleBetweenBaseCenters(cs, cs3);
      a5 = normalizeAngle(a5, a3);
      return (a5 + a3) / 2;
    } else if (cs5) {
      return Sequence._angleBetweenBaseCenters(cs, cs5) - (Math.PI / 2);
    } else if (cs3) {
      return Sequence._angleBetweenBaseCenters(cs, cs3) + (Math.PI / 2);
    }
    return Math.PI / 2;
  }

  static _clockwiseNormalAngleAtPositionFromSavedState(
    p: number,
    savedState: SequenceSavableState,
    svg: Svg,
  ): number {
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

  static _innerNormalAngleOfBase(
    cs: BaseCoordinates,
    cs5?: BaseCoordinates,
    cs3?: BaseCoordinates,
  ): number {
    let cna = Sequence._clockwiseNormalAngleOfBase(cs, cs5, cs3);
    if (!cs5 || !cs3) {
      return cna;
    }
    let a5 = Sequence._angleBetweenBaseCenters(cs, cs5);
    let a3 = Sequence._angleBetweenBaseCenters(cs, cs3);
    a5 = normalizeAngle(a5, a3);
    if (a5 - a3 < Math.PI) {
      return cna;
    }
    return cna + Math.PI;
  }

  /**
   * Returns null if the saved state is invalid.
   */
  static fromSavedState(savedState: SequenceSavableState, svg: Svg): (Sequence | null) {
    if (!savedState.id || !savedState.bases) {
      return null;
    }
    let seq = new Sequence(savedState.id);
    seq.numberingOffset = savedState.numberingOffset ?? 0;
    seq.numberingAnchor = savedState.numberingAnchor ?? 0;
    seq.numberingIncrement = savedState.numberingIncrement ?? 20;
    let bases = [] as Base[];
    let invalid = false;
    savedState.bases.forEach(sb => {
      let b = Base.fromSavedState(sb, svg);
      bases.push(b);
      invalid = invalid || !b;
    });
    if (invalid) {
      return null;
    }
    seq.appendBases(bases);
    Sequence._copyPropsToMostRecent(seq);
    return seq;
  }

  static createOutOfView(svg: Svg, id: string, characters: string): Sequence {
    let seq = new Sequence(id);
    let bases = [];
    for (let c of characters) {
      bases.push(Base.createOutOfView(svg, c));
    }
    seq.appendBases(bases);
    Sequence._applyMostRecentProps(seq);
    return seq;
  }

  constructor(id: string) {
    this._id = id;
    this._bases = [];
    this._numberingOffset = 0;
    this._numberingAnchor = 0;
    this._numberingIncrement = 20;
  }

  get id(): string {
    return this._id;
  }

  get characters(): string {
    let cs = '';
    this.forEachBase((b: Base) => {
      cs += b.character;
    });
    return cs;
  }

  _updateBaseNumberings() {
    this.forEachBase((b: Base, p: number) => {
      if ((p - this.numberingAnchor) % this.numberingIncrement == 0) {
        let n = b.addNumbering(p + this.numberingOffset);
        n.lineAngle = this.outerNormalAngleAtPosition(p);
      } else {
        b.removeNumbering();
      }
    });
  }

  get numberingOffset(): number {
    return this._numberingOffset;
  }

  set numberingOffset(no: number) {
    this.setNumberingOffset(no);
  }

  setNumberingOffset(no: number) {
    if (!isFinite(no) || Math.floor(no) !== no) {
      return;
    }
    this._numberingOffset = no;
    this._updateBaseNumberings();
  }

  get numberingAnchor(): number {
    return this._numberingAnchor;
  }

  set numberingAnchor(na: number) {
    this.setNumberingAnchor(na);
  }

  setNumberingAnchor(na: number) {
    if (!isFinite(na) || Math.floor(na) !== na) {
      return;
    }
    this._numberingAnchor = na;
    this._updateBaseNumberings();
    Sequence._mostRecentProps.numberingAnchor = na;
  }

  get numberingIncrement(): number {
    return this._numberingIncrement;
  }

  set numberingIncrement(ni: number) {
    this.setNumberingIncrement(ni);
  }

  setNumberingIncrement(ni: number) {
    if (!isFinite(ni) || Math.floor(ni) !== ni) {
      return;
    } else if (ni < 1) {
      return;
    }
    this._numberingIncrement = ni;
    this._updateBaseNumberings();
    Sequence._mostRecentProps.numberingIncrement = ni;
  }

  get length(): number {
    return this._bases.length;
  }

  offsetPosition(p: number): number {
    return p + this.numberingOffset;
  }

  reversePositionOffset(op: number): number {
    return op - this.numberingOffset;
  }

  positionOutOfRange(p: number): boolean {
    return p < 1 || p > this.length;
  }

  positionInRange(p: number): boolean {
    return !this.positionOutOfRange(p);
  }

  offsetPositionOutOfRange(op: number): boolean {
    let p = this.reversePositionOffset(op);
    return this.positionOutOfRange(p);
  }

  offsetPositionInRange(op: number): boolean {
    let p = this.reversePositionOffset(op);
    return this.positionInRange(p);
  }

  getBaseAtPosition(p: number): (Base | undefined) {
    return this._bases[p - 1];
  }

  getBaseAtOffsetPosition(op: number): (Base | undefined) {
    let p = this.reversePositionOffset(op);
    return this.getBaseAtPosition(p);
  }

  getBaseById(id: string): (Base | undefined) {
    return this._bases.find(b => b.id === id);
  }

  /**
   * The returned bases will include the bases at the given
   * 5' and 3' most positions.
   * 
   * The bases are returned in ascending order.
   */
  getBasesInRange(p5: number, p3: number): Base[] {
    return this._bases.slice(p5 - 1, p3);
  }

  forEachBase(f: (b: Base, position: number) => void) {
    this._bases.forEach((b, i) => f(b, i + 1));
  }

  baseIds(): string[] {
    let ids = [] as string[];
    this.forEachBase(b => ids.push(b.id));
    return ids;
  }

  /**
   * Returns zero if the given base is not in this sequence.
   */
  positionOfBase(b: Base): number {
    return this._bases.findIndex(base => base.id === b.id) + 1;
  }

  /**
   * Returns the minimum offset position of this sequence minus one if
   * the given base is not in this sequence.
   */
  offsetPositionOfBase(b: Base) {
    let p = this.positionOfBase(b);
    return this.offsetPosition(p);
  }

  contains(b: Base): boolean {
    return this.positionOfBase(b) > 0;
  }

  /**
   * Returns null if the given position is out of range.
   */
  clockwiseNormalAngleAtPosition(p: number): (number | null) {
    if (this.positionOutOfRange(p)) {
      return null;
    }
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

  /**
   * Returns null if the given position is out of range.
   */
  counterClockwiseNormalAngleAtPosition(p: number): (number | null) {
    if (this.positionOutOfRange(p)) {
      return null;
    }
    return Math.PI + this.clockwiseNormalAngleAtPosition(p);
  }

  /**
   * Returns null if the given position is out of range.
   */
  innerNormalAngleAtPosition(p: number): (number | null) {
    if (this.positionOutOfRange(p)) {
      return null;
    }
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

  /**
   * Returns null if the given position is out of range.
   */
  outerNormalAngleAtPosition(p: number): (number | null) {
    if (this.positionOutOfRange(p)) {
      return null;
    }
    return Math.PI + this.innerNormalAngleAtPosition(p);
  }

  /**
   * Appends the given base to the end of this sequence.
   * 
   * Has no effect if the given base is already in this sequence.
   */
  appendBase(b: Base) {
    if (this.contains(b)) {
      return;
    }
    this._bases.push(b);
    this.fireAddBase(b);
    this._updateBaseNumberings();
  }

  /**
   * This method has no effect if this sequence already contains
   * any of the given bases.
   */
  appendBases(bs: Base[]) {
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
      this.fireAddBase(b);
    });
    this._updateBaseNumberings();
  }

  /**
   * If the position is one plus the length of this sequence, the base will
   * be appended to the end of this sequence.
   * 
   * Has no effect if the given base is already in this sequence or if the
   * given position is out of range.
   */
  insertBaseAtPosition(b: Base, p: number) {
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
    this.fireAddBase(b);
    this._updateBaseNumberings();
  }

  onAddBase(f: (b: Base) => void) {
    this._onAddBase = f;
  }

  fireAddBase(b: Base) {
    if (this._onAddBase) {
      this._onAddBase(b);
    }
  }

  /**
   * Has no effect if the given position is out of range.
   */
  removeBaseAtPosition(p: number) {
    let b = this.getBaseAtPosition(p);
    if (b) {
      b.remove();
      this._bases.splice(p - 1, 1);
      this._updateBaseNumberings();
    }
  }

  remove() {
    this.forEachBase(b => b.remove());
    this._bases = [];
  }

  savableState(): SequenceSavableState {
    let savableState = {
      className: 'Sequence',
      id: this.id,
      bases: [] as BaseSavableState[],
      numberingOffset: this.numberingOffset,
      numberingAnchor: this.numberingAnchor,
      numberingIncrement: this.numberingIncrement,
    };
    this.forEachBase(
      b => savableState.bases.push(b.savableState())
    );
    return savableState;
  }

  refreshIds() {
    this.forEachBase(b => b.refreshIds());
  }
}

Sequence._mostRecentProps = {
  numberingAnchor: 0,
  numberingIncrement: 20,
};

export default Sequence;
