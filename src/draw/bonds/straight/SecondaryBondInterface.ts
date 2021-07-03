import { StraightBondInterface } from './StraightBondInterface';

export const secondaryBondTypes = ['AUT', 'GC', 'GUT', 'other'] as const;
export type SecondaryBondType = typeof secondaryBondTypes[number];

export interface SecondaryBondInterface extends StraightBondInterface {
  readonly type: SecondaryBondType;
}
