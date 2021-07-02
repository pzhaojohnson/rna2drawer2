import { PrimaryBondInterface as PrimaryBond } from 'Draw/bonds/straight/PrimaryBondInterface';

export interface FieldProps {
  getPrimaryBonds: () => PrimaryBond[];
  pushUndo: () => void;
  changed: () => void;
}
