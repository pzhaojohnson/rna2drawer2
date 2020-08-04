import StrictDrawing from '../../StrictDrawing';

export interface FoldingModeInterface {
  readonly strictDrawing: StrictDrawing;

  hovered?: number | null;
  selected?: {
    tightEnd: number;
    looseEnd: number;
  } | null;
  selecting?: boolean;

  reset: () => void;

  disable: () => void;
  disabled: () => boolean;
  enable: () => void;
  enabled: () => boolean;

  fireShouldPushUndo: () => void;
  fireChange: () => void;
}

export default FoldingModeInterface;
