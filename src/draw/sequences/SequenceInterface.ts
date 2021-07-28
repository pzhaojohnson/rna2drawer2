import {
  BaseInterface as Base,
  BaseSavableState,
} from 'Draw/bases/BaseInterface';

export interface SequenceMostRecentProps {
  numberingAnchor: number;
  numberingIncrement: number;
}

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
  offsetPosition(p: number): number;
  reversePositionOffset(op: number): number;
  positionOutOfRange(p: number): boolean;
  positionInRange(p: number): boolean;
  offsetPositionOutOfRange(p: number): boolean;
  offsetPositionInRange(p: number): boolean;
  getBaseAtPosition(p: number): Base | undefined;
  getBaseAtOffsetPosition(op: number): Base | undefined;
  getBaseById(id: string): Base | undefined;
  getBasesInRange(p5: number, p3: number): Base[];
  forEachBase(f: (b: Base, p: number) => void): void;
  baseIds(): string[];
  positionOfBase(b: Base): number;
  offsetPositionOfBase(b: Base): number;
  contains(b: Base): boolean;
  clockwiseNormalAngleAtPosition(p: number): number;
  counterClockwiseNormalAngleAtPosition(p: number): number;
  innerNormalAngleAtPosition(p: number): number;
  outerNormalAngleAtPosition(p: number): number;
  appendBase(b: Base): void;
  appendBases(bs: Base[]): void;
  insertBasesAtPosition(bs: Base[], p: number): void;
  onAddBase(f: (b: Base) => void): void;
  fireAddBase(b: Base): void;
  removeBaseAtPosition(p: number): void;
  removeBasesInRange(p5: number, p3: number): void;
  remove(): void;
  savableState(): SequenceSavableState;
}

export default SequenceInterface;
