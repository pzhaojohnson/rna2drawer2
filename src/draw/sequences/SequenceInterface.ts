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
  atPosition(p: number): Base | undefined;
  getBaseAtPosition(p: number): Base | undefined;

  // returns 0 if the given base is not in the sequence
  positionOf(b: Base): number;

  // returns a map of bases to their positions in the sequence
  basesToPositions(): Map<Base, number>;
}
