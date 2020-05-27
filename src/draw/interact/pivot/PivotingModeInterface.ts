import StrictDrawing from '../../StrictDrawing';
import Base from '../../Base';

export interface ShouldPushUndoFunc {
  (): void;
}

export interface ChangeFunc {
  (): void;
}

export interface PivotingModeInterface {
  className: string;
  strictDrawing: StrictDrawing;
  handleMouseoverOnBase: (b: Base) => void;
  handleMouseoutOnBase: (b: Base) => void;
  handleMousedownOnBase: (b: Base) => void;
  handleMousedownOnDrawing: () => void;
  selectedPosition: number | null;
  pivoted: boolean;
  onlyAddStretch: () => void;
  onlyAddingStretch: () => boolean;
  addAndRemoveStretch: () => void;
  reset: () => void;
  disable: () => void;
  disabled: () => boolean;
  enable: () => void;
  enabled: () => boolean;
  onShouldPushUndo: (f: ShouldPushUndoFunc) => void;
  fireShouldPushUndo: () => void;
  onChange: (f: ChangeFunc) => void;
  fireChange: () => void;
}

export default PivotingModeInterface;
