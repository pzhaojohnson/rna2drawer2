import type { Base } from 'Draw/bases/Base';
import { BaseNumberingInterface } from 'Draw/bases/number/BaseNumberingInterface';
import type { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import type { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { TertiaryBondInterface } from 'Draw/bonds/curved/TertiaryBondInterface';

export type DrawingElementInterface = (
  Base
  | BaseNumberingInterface
  | PrimaryBond
  | SecondaryBond
  | TertiaryBondInterface
);
