import { StraightBondInterface } from './StraightBondInterface';

export const secondaryBondTypes = ['AUT', 'GC', 'GUT', 'other'] as const;
export type SecondaryBondType = typeof secondaryBondTypes[number];

export interface SecondaryBondInterface extends StraightBondInterface {
  readonly type: SecondaryBondType;
  isAUT(): boolean;
  isGC(): boolean;
  isGUT(): boolean;
  padding1: number;
  padding2: number;
  stroke: string;
  strokeWidth: number;
}
