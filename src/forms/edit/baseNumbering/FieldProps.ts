import { BaseNumberingInterface as BaseNumbering } from 'Draw/bases/number/BaseNumberingInterface';

export interface FieldProps {
  getBaseNumberings: () => BaseNumbering[];
  pushUndo: () => void;
  changed: () => void;
}
