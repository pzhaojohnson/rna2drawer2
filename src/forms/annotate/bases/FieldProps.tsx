import { BaseInterface as Base } from 'Draw/bases/BaseInterface';

export type FieldProps = {
  selectedBases: () => Base[];
  pushUndo: () => void;
  changed: () => void;
}
