import Sequence from './Sequence';
import { SequenceSavableState } from './SequenceInterface';
import { BaseInterface as Base } from './BaseInterface';
import {
  PrimaryBondInterface as PrimaryBond,
  SecondaryBondInterface as SecondaryBond,
  StraightBondSavableState,
} from './StraightBondInterface';
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
  sequences: SequenceSavableState[];
  primaryBonds: StraightBondSavableState[];
  secondaryBonds: StraightBondSavableState[];
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
