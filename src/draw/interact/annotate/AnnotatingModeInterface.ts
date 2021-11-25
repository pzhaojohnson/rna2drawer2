import { StrictDrawingInterface as StrictDrawing } from 'Draw/strict/StrictDrawingInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import * as React from 'react';

export interface FormFactory {
  (close: () => void): React.ReactElement;
}

export interface AnnotatingModeInterface {
  hovered?: number;
  selected: Set<number>;
  selectingFrom?: number;

  deselectingOnDblclick?: boolean;

  readonly className: string;

  readonly strictDrawing: StrictDrawing;

  handleMouseoverOnBase(b: Base): void;
  handleMouseoutOnBase(b: Base): void;
  handleMousedownOnBase(b: Base): void;
  handleMousedownOnDrawing(): void;
  handleDblclickOnDrawing(): void;
  select(ps: number[]): void;
  clearSelection(): void;
  reset(): void;

  disabled(): boolean;
  disable(): void;
  enabled(): boolean;
  enable(): void;

  onShouldPushUndo(f: () => void): void;
  fireShouldPushUndo(): void;
  onChange(f: () => void): void;
  fireChange(): void;
  onRequestToRenderForm(f: (ff: FormFactory) => void): void;
  requestToRenderForm(): void;
  closeForm(): void;
}

export default AnnotatingModeInterface;
