import type { Base } from 'Draw/bases/Base';
import { BaseNumberingInterface } from 'Draw/bases/number/BaseNumberingInterface';
import { PrimaryBondInterface } from 'Draw/bonds/straight/PrimaryBondInterface';
import { SecondaryBondInterface } from 'Draw/bonds/straight/SecondaryBondInterface';
import { TertiaryBondInterface } from 'Draw/bonds/curved/TertiaryBondInterface';

export type DrawingElementInterface = (
  Base
  | BaseNumberingInterface
  | PrimaryBondInterface
  | SecondaryBondInterface
  | TertiaryBondInterface
);
