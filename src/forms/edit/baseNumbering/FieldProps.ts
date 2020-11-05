import { BaseNumberingInterface as BaseNumbering } from '../../../draw/BaseNumberingInterface';

export interface FieldProps {
  getBaseNumberings: () => BaseNumbering[];
  pushUndo: () => void;
  changed: () => void;
}
