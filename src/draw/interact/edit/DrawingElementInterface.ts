import type { Base } from 'Draw/bases/Base';
import { BaseNumberingInterface } from 'Draw/bases/number/BaseNumberingInterface';
import type { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import type { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import type { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

export type DrawingElementInterface = (
  Base
  | BaseNumberingInterface
  | PrimaryBond
  | SecondaryBond
  | TertiaryBond
);
