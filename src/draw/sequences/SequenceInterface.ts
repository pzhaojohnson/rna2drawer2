import {
  BaseInterface as Base,
  BaseSavableState,
} from 'Draw/bases/BaseInterface';

export interface SequenceSavableState {
  className: string;
  id: string;
  bases: BaseSavableState[];
  numberingOffset: number;
  numberingAnchor: number;
  numberingIncrement: number;
}

export interface SequenceInterface {
  id: string;
  bases: Base[];
  characters: string;
  numberingOffset: number;
  numberingAnchor: number;
  numberingIncrement: number;
  length: number;
  positionOutOfRange(p: number): boolean;
  positionInRange(p: number): boolean;
  getBaseAtPosition(p: number): Base | undefined;
  savableState(): SequenceSavableState;
}
