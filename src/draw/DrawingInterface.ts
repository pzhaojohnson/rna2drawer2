import Sequence from './Sequence';
import { BaseInterface as Base } from './BaseInterface';
import { PrimaryBond, SecondaryBond } from './StraightBond';
import { TertiaryBond } from './QuadraticBezierBond';

export interface ForEachSequenceFunc {
  (seq: Sequence): void;
}

export interface ForEachBaseFunc {
  (b: Base, overallPosition: number): void;
}

export interface ForEachSecondaryBondFunc {
  (sb: SecondaryBond): void;
}

export interface DrawingSavableState {
  className: string;
  svg: string;
  sequences: object[];
  primaryBonds: object[];
  secondaryBonds: object[];
  tertiaryBonds: object[];
}

export interface DrawingInterface {
  centerView: () => void;
  
  getSequenceById: (id: string) => Sequence;
  forEachSequence(f: ForEachSequenceFunc): void;
  appendSequenceOutOfView: (id: string, characters: string) => Sequence;

  overallPositionOfBase: (b: Base) => number;

  addPrimaryBond: (b1: Base, b2: Base) => PrimaryBond;

  addSecondaryBond: (b1: Base, b2: Base) => SecondaryBond;
  forEachSecondaryBond(f: ForEachSecondaryBondFunc): void;
  
  addTertiaryBond: (b1: Base, b2: Base) => TertiaryBond;

  savableState: () => DrawingSavableState;
}

export default DrawingInterface;
