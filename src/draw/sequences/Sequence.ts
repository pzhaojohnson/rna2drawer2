import { SequenceInterface } from './SequenceInterface';
import * as Svg from '@svgdotjs/svg.js';
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
    this.bases.forEach(b => {
      cs += b.character;
    });
    return cs;
  }

  get numberingOffset(): number {
    return this._numberingOffset;
  }

  set numberingOffset(no: number) {
    if (!Number.isFinite(no) || Math.floor(no) !== no) {
      return;
    }
    this._numberingOffset = no;
    updateBaseNumberings(this);
  }

  get numberingAnchor(): number {
    return this._numberingAnchor;
  }

  set numberingAnchor(na: number) {
    if (!Number.isFinite(na) || Math.floor(na) !== na) {
      return;
    }
    this._numberingAnchor = na;
    updateBaseNumberings(this);
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
    updateBaseNumberings(this);
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
}

Sequence.recommendedDefaults = {
  numberingAnchor: 20,
  numberingIncrement: 20,
};
