import Sequence from './Sequence';
import { BaseInterface as Base } from './BaseInterface';
import { PrimaryBond, SecondaryBond } from './StraightBond';
import { TertiaryBond } from './QuadraticBezierBond';

export interface DrawingSavableState {}

export interface DrawingInterface {
  centerView: () => void;
  
  getSequenceById: (id: string) => Sequence;
  appendSequenceOutOfView: (id: string, characters: string) => Sequence;

  overallPositionOfBase: (b: Base) => number;

  addPrimaryBond: (b1: Base, b2: Base) => PrimaryBond;

  addSecondaryBond: (b1: Base, b2: Base) => SecondaryBond;
  
  addTertiaryBond: (b1: Base, b2: Base) => TertiaryBond;

  savableState: () => DrawingSavableState;
}

export default DrawingInterface;
