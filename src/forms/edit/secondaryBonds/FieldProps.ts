import { AppInterface as App } from '../../../AppInterface';
import { SecondaryBondInterface as SecondaryBond } from 'Draw/bonds/straight/StraightBondInterface';

export interface SecondaryBondsByType {
  aut: SecondaryBond[];
  gc: SecondaryBond[];
  gut: SecondaryBond[];
  other: SecondaryBond[];
}

export interface FieldProps {
  app: App;
  getSecondaryBondsByType: () => SecondaryBondsByType;
  getAllSecondaryBonds: () => SecondaryBond[];
  pushUndo: () => void;
  changed: () => void;
}
