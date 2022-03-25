import type { Base } from 'Draw/bases/Base';
import type { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import type { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import type { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import type { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

export type DrawingElementInterface = (
  Base
  | BaseNumbering
  | PrimaryBond
  | SecondaryBond
  | TertiaryBond
);
