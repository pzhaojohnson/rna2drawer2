import { StrictDrawingInterface as StrictDrawing } from 'Draw/StrictDrawingInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';

export type FieldProps = {
  strictDrawing: StrictDrawing;
  selectedBases: () => Base[];
  clearSelection: () => void;
  pushUndo: () => void;
  changed: () => void;
}
