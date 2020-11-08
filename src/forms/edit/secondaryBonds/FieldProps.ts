import { SecondaryBondInterface as SecondaryBond } from '../../../draw/StraightBondInterface';

export interface SecondaryBondsByType {
  aut: SecondaryBond[];
  gc: SecondaryBond[];
  gut: SecondaryBond[];
  other: SecondaryBond[];
}

export interface FieldProps {
  getSecondaryBondsByType: () => SecondaryBondsByType;
  getAllSecondaryBonds: () => SecondaryBond[];
  pushUndo: () => void;
  changed: () => void;
}
