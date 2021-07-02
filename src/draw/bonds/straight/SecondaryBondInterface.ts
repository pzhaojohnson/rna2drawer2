import { StraightBondInterface } from './StraightBondInterface';

export interface SecondaryBondMostRecentProps {
  padding1: number;
  padding2: number;
  autStroke: string;
  gcStroke: string;
  gutStroke: string;
  otherStroke: string;
  strokeWidth: number;
}

export interface SecondaryBondInterface extends StraightBondInterface {
  isAUT(): boolean;
  isGC(): boolean;
  isGUT(): boolean;
  padding1: number;
  padding2: number;
  stroke: string;
  strokeWidth: number;
}
