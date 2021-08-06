import { BaseInterface as Base } from 'Draw/bases/BaseInterface';

export interface SequenceInterface {
  id: string;
  readonly bases: Base[];
  characters: string;
  numberingOffset: number;
  numberingAnchor: number;
  numberingIncrement: number;
  length: number;
  positionOutOfRange(p: number): boolean;
  positionInRange(p: number): boolean;
  getBaseAtPosition(p: number): Base | undefined;
}
