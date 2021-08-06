import { SequenceInterface } from './SequenceInterface';
import { Base } from 'Draw/bases/Base';
import { updateBaseNumberings } from './number';

export type Defaults = {
  numberingAnchor: number;
  numberingIncrement: number;
}

export class Sequence implements SequenceInterface {
  static recommendedDefaults: Defaults;

  id: string;
  bases: Base[];

  _numberingOffset: number;
  _numberingAnchor: number;
  _numberingIncrement: number;

  constructor(id: string) {
    this.id = id;
    this.bases = [];

    this._numberingOffset = 0;
    this._numberingAnchor = Sequence.recommendedDefaults.numberingAnchor;
    this._numberingIncrement = Sequence.recommendedDefaults.numberingIncrement;
  }

  get characters(): string {
    let cs = '';
    this.bases.forEach(b => {
      cs += b.character;
    });
    return cs;
  }

  get numberingOffset(): number {
    return this._numberingOffset;
  }

  set numberingOffset(no: number) {
    if (Number.isFinite(no)) {
      this._numberingOffset = Math.floor(no);
      updateBaseNumberings(this);
    }
  }

  get numberingAnchor(): number {
    return this._numberingAnchor;
  }

  set numberingAnchor(na: number) {
    if (Number.isFinite(na)) {
      this._numberingAnchor = Math.floor(na);
      updateBaseNumberings(this);
      Sequence.recommendedDefaults.numberingAnchor = na;
    }
  }

  get numberingIncrement(): number {
    return this._numberingIncrement;
  }

  set numberingIncrement(ni: number) {
    if (Number.isFinite(ni) && ni >= 1) {
      this._numberingIncrement = Math.floor(ni);
      updateBaseNumberings(this);
      Sequence.recommendedDefaults.numberingIncrement = ni;
    }
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
}

Sequence.recommendedDefaults = {
  numberingAnchor: 20,
  numberingIncrement: 20,
};
