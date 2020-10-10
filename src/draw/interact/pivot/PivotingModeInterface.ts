import { StrictDrawingInterface as StrictDrawing } from '../../StrictDrawingInterface';
import { BaseInterface as Base } from '../../BaseInterface';

export interface Stem {
  position5: number;
  position3: number;
  size: number;
}

export interface UnpairedRegion {
  boundingPosition5: number;
  boundingPosition3: number;
}

export interface PivotingModeInterface {
  className: string;
  strictDrawing: StrictDrawing;

  hovered?: Stem;
  selected?: Stem;

  pivoted?: boolean;

  handleMouseoverOnBase(b: Base): void;
  handleMouseoutOnBase(b: Base): void;
  handleMousedownOnBase(b: Base): void;
  handleMousedownOnDrawing(): void;

  onlyAddStretch(): void;
  onlyAddingStretch(): boolean;
  addAndRemoveStretch(): void;

  reset(): void;

  disable(): void;
  disabled(): boolean;
  enable(): void;
  enabled(): boolean;

  onShouldPushUndo(f: () => void): void;
  fireShouldPushUndo(): void;
  onChange(f: () => void): void;
  fireChange(): void;
}
