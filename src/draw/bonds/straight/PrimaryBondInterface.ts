import { StraightBondInterface } from './StraightBondInterface';

export interface PrimaryBondInterface extends StraightBondInterface {
  padding1: number;
  padding2: number;
  stroke: string;
  strokeWidth: number;
}
