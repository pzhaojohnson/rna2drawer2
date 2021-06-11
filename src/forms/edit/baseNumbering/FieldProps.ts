import { BaseNumberingInterface as BaseNumbering } from 'Draw/bases/numbering/BaseNumberingInterface';

export interface FieldProps {
  getBaseNumberings: () => BaseNumbering[];
  pushUndo: () => void;
  changed: () => void;
}
