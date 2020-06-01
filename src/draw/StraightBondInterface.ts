import Base from './Base'

export interface StraightBondSavableState {
  className: string;
  lineId: string;
  baseId1: string;
  baseId2: string;
}

export interface StraightBondInterface {
  base1: Base;
  base2: Base;
  padding1: number;
  padding2: number;
}

export interface PrimaryBondMostRecentProps {
  padding1: number;
  padding2: number;
  stroke: string;
  strokeWidth: number;
}

export interface PrimaryBondInterface extends StraightBondInterface {}

export interface SecondaryBondMostRecentProps {
  padding1: number;
  padding2: number;
  autStroke: string;
  gcStroke: string;
  gutStroke: string;
  otherStroke: string;
  strokeWidth: number;
}

export interface SecondaryBondInterface extends StraightBondInterface {}

export default StraightBondInterface;
