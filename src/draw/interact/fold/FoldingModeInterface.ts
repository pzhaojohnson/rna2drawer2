import { StrictDrawing } from 'Draw/strict/StrictDrawing';

export interface FoldingModeInterface {
  readonly strictDrawing: StrictDrawing;

  hovered?: number | null;
  selected?: {
    tightEnd: number;
    looseEnd: number;
  } | null;
  selecting?: boolean;

  deselectingOnDblclick?: boolean;

  // whether to include GUT pairs in complments
  includeGUT: boolean;

  // allowed mismatch proportion in complements
  allowedMismatch: number;
  readonly allowedMismatchPrecision: number;

  reset: () => void;

  pairComplements: () => void;
  pairingComplements: () => boolean;
  forcePair: () => void;
  forcePairing: () => boolean;
  onlyAddTertiaryBonds: () => void;
  onlyAddingTertiaryBonds: () => boolean;

  disable: () => void;
  disabled: () => boolean;
  enable: () => void;
  enabled: () => boolean;

  fireShouldPushUndo: () => void;
  fireChange: () => void;
}

export default FoldingModeInterface;
