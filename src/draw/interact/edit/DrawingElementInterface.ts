import { BaseInterface } from 'Draw/bases/BaseInterface';
import { BaseNumberingInterface } from 'Draw/bases/number/BaseNumberingInterface';
import { PrimaryBondInterface } from 'Draw/bonds/straight/PrimaryBondInterface';
import { SecondaryBondInterface } from 'Draw/bonds/straight/SecondaryBondInterface';
import { TertiaryBondInterface } from 'Draw/bonds/curved/TertiaryBondInterface';

export type DrawingElementInterface = (
  BaseInterface
  | BaseNumberingInterface
  | PrimaryBondInterface
  | SecondaryBondInterface
  | TertiaryBondInterface
);
