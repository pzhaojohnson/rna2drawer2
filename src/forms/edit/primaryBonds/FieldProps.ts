import { PrimaryBondInterface as PrimaryBond } from '../../../draw/StraightBondInterface';

export interface FieldProps {
  getPrimaryBonds: () => PrimaryBond[];
  pushUndo: () => void;
  changed: () => void;
}
