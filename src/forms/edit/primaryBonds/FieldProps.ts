import { PrimaryBondInterface as PrimaryBond } from 'Draw/bonds/straight/StraightBondInterface';

export interface FieldProps {
  getPrimaryBonds: () => PrimaryBond[];
  pushUndo: () => void;
  changed: () => void;
}
