import {
  SequenceInterface,
  SequenceMostRecentProps,
  SequenceSavableState,
} from './SequenceInterface';
import * as Svg from '@svgdotjs/svg.js';
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

  _onAddBase?: (b: Base) => void;

  static mostRecentProps(): SequenceMostRecentProps {
    return { ...Sequence._mostRecentProps };
  }

  static _applyMostRecentProps(seq: Sequence) {
    let props = Sequence.mostRecentProps();
    seq.numberingAnchor = props.numberingAnchor;
    seq.numberingIncrement = props.numberingIncrement;
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

  static fromSavedState(savedState: SequenceSavableState, svg: Svg.Svg): (Sequence | never) {
    if (savedState.className !== 'Sequence') {
      throw new Error('Wrong class name.');
    }
    let seq = new Sequence(savedState.id);
    seq.numberingOffset = savedState.numberingOffset ?? 0;
    seq.numberingAnchor = savedState.numberingAnchor ?? 0;
    seq.numberingIncrement = savedState.numberingIncrement ?? 20;
    let bases = [] as Base[];
    savedState.bases.forEach(sb => {
      let b = Base.fromSavedState(sb, svg);
      bases.push(b);
    });
    seq.appendBases(bases);
    Sequence._copyPropsToMostRecent(seq);
    return seq;
  }

  static createOutOfView(svg: Svg.Svg, id: string, characters: string): Sequence {
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
    this._numberingAnchor = 20;
    this._numberingIncrement = 20;
  }

  get id(): string {
    return this._id;
  }

  set id(i: string) {
    this._id = i;
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
        if (n) {
          n.lineAngle = this.outerNormalAngleAtPosition(p);
        }
      } else {
        b.removeNumbering();
      }
    });
  }

  get numberingOffset(): number {
    return this._numberingOffset;
  }

  set numberingOffset(no: number) {
    if (!Number.isFinite(no) || Math.floor(no) !== no) {
      return;
    }
    this._numberingOffset = no;
    this._updateBaseNumberings();
  }

  get numberingAnchor(): number {
    return this._numberingAnchor;
  }

  set numberingAnchor(na: number) {
    if (!Number.isFinite(na) || Math.floor(na) !== na) {
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
    if (!Number.isFinite(ni) || Math.floor(ni) !== ni) {
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
   *
   * It is undefined what bases are returned when the given
   * positions are out of range.
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
   * Returns zero if the given position is out of range.
   */
  clockwiseNormalAngleAtPosition(p: number): number {
    if (this.positionOutOfRange(p)) {
      return 0;
    }
    let b = this.getBaseAtPosition(p) as Base;
    let cs = { xCenter: b.xCenter, yCenter: b.yCenter };
    let cs5;
    let cs3;
    if (p > 1) {
      let b5 = this.getBaseAtPosition(p - 1) as Base;
      cs5 = { xCenter: b5.xCenter, yCenter: b5.yCenter };
    }
    if (p < this.length) {
      let b3 = this.getBaseAtPosition(p + 1) as Base;
      cs3 = { xCenter: b3.xCenter, yCenter: b3.yCenter };
    }
    return Sequence._clockwiseNormalAngleOfBase(cs, cs5, cs3);
  }

  /**
   * Returns Math.PI if the given position is out of range.
   */
  counterClockwiseNormalAngleAtPosition(p: number): number {
    return Math.PI + this.clockwiseNormalAngleAtPosition(p);
  }

  /**
   * Returns zero if the given position is out of range.
   */
  innerNormalAngleAtPosition(p: number): number {
    if (this.positionOutOfRange(p)) {
      return 0;
    }
    let b = this.getBaseAtPosition(p) as Base;
    let cs = { xCenter: b.xCenter, yCenter: b.yCenter };
    let cs5;
    let cs3;
    if (p > 1) {
      let b5 = this.getBaseAtPosition(p - 1) as Base;
      cs5 = { xCenter: b5.xCenter, yCenter: b5.yCenter };
    }
    if (p < this.length) {
      let b3 = this.getBaseAtPosition(p + 1) as Base;
      cs3 = { xCenter: b3.xCenter, yCenter: b3.yCenter };
    }
    return Sequence._innerNormalAngleOfBase(cs, cs5, cs3);
  }

  /**
   * Returns Math.PI if the given position is out of range.
   */
  outerNormalAngleAtPosition(p: number): number {
    return Math.PI + this.innerNormalAngleAtPosition(p);
  }

  appendBase(b: Base) {
    this._bases.push(b);
    this.fireAddBase(b);
    this._updateBaseNumberings();
  }

  appendBases(bs: Base[]) {
    bs.forEach(b => {
      this._bases.push(b);
      this.fireAddBase(b);
    });
    this._updateBaseNumberings();
  }

  insertBasesAtPosition(bs: Base[], p: number) {
    if (p > this.length) {
      p = this.length + 1;
    } else if (p < 1) {
      p = 1;
    }
    this._bases.splice(p - 1, 0, ...bs);
    bs.forEach(b => this.fireAddBase(b));
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

  /**
   * The bases at the boundary positions p5 and p3 of the range will be removed
   * along with the bases in the middle of the range.
   */
  removeBasesInRange(p5: number, p3: number) {
    for (let p = p5; p <= p3; p++) {
      let b = this.getBaseAtPosition(p);
      if (b) {
        b.remove();
      }
    }
    this._bases.splice(p5 - 1, p3 - p5 + 1);
    this._updateBaseNumberings();
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
  numberingAnchor: 20,
  numberingIncrement: 20,
};

export default Sequence;
