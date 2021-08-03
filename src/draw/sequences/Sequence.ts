import {
  SequenceInterface,
  SequenceSavableState,
} from './SequenceInterface';
import * as Svg from '@svgdotjs/svg.js';
import { Base } from 'Draw/bases/Base';
import { BaseSavableState } from 'Draw/bases/BaseInterface';
import { addNumbering } from 'Draw/bases/number/add';
import { removeNumbering } from 'Draw/bases/number/add';
import angleBetween from 'Draw/angleBetween';
import normalizeAngle from 'Draw/normalizeAngle';

export type Defaults = {
  numberingAnchor: number;
  numberingIncrement: number;
}

interface BaseCoordinates {
  xCenter: number;
  yCenter: number;
}

export class Sequence implements SequenceInterface {
  static recommendedDefaults: Defaults;

  id: string;
  bases: Base[];
  _numberingOffset: number;
  _numberingAnchor: number;
  _numberingIncrement: number;

  _onAddBase?: (b: Base) => void;

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
    seq.bases.splice(0, 0, ...bases);
    Sequence.recommendedDefaults.numberingAnchor = seq.numberingAnchor;
    Sequence.recommendedDefaults.numberingIncrement = seq.numberingIncrement;
    return seq;
  }

  static createOutOfView(svg: Svg.Svg, id: string, characters: string): Sequence {
    let seq = new Sequence(id);
    let bases = [];
    for (let c of characters) {
      bases.push(Base.createOutOfView(svg, c));
    }
    seq.bases.splice(0, 0, ...bases);
    seq.numberingAnchor = Sequence.recommendedDefaults.numberingAnchor;
    seq.numberingIncrement = Sequence.recommendedDefaults.numberingIncrement;
    return seq;
  }

  constructor(id: string) {
    this.id = id;
    this.bases = [];
    this._numberingOffset = 0;
    this._numberingAnchor = 20;
    this._numberingIncrement = 20;
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
        addNumbering(b, p + this.numberingOffset);
        if (b.numbering) {
          b.numbering.lineAngle = this.outerNormalAngleAtPosition(p);
        }
      } else {
        removeNumbering(b);
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
    Sequence.recommendedDefaults.numberingAnchor = na;
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
    Sequence.recommendedDefaults.numberingIncrement = ni;
  }

  get length(): number {
    return this.bases.length;
  }

  positionOutOfRange(p: number): boolean {
    return p < 1 || p > this.length;
  }

  positionInRange(p: number): boolean {
    return !this.positionOutOfRange(p);
  }

  getBaseAtPosition(p: number): (Base | undefined) {
    return this.bases[p - 1];
  }

  forEachBase(f: (b: Base, position: number) => void) {
    this.bases.forEach((b, i) => f(b, i + 1));
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
}

Sequence.recommendedDefaults = {
  numberingAnchor: 20,
  numberingIncrement: 20,
};

export default Sequence;
