import StrictDrawing from '../../StrictDrawing';

export interface FoldingModeInterface {
  readonly strictDrawing: StrictDrawing;

  hovered: number | null;
  selected: {
    tightEnd: number;
    looseEnd: number;
  } | null;
  selecting: boolean;

  readonly minSelected: number | null;
  readonly maxSelected: number | null;
  readonly selectedLength: number;
  withinSelected: (p: number) => boolean;
  overlapsSelected: (position5: number, position3: number) => boolean;
  hoveringSelected: () => boolean;

  reset: () => void;

  disable: () => void;
  disabled: () => boolean;
  enable: () => void;
  enabled: () => boolean;

  fireShouldPushUndo: () => void;
  fireChange: () => void;
}

export default FoldingModeInterface;
