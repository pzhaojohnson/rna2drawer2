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
