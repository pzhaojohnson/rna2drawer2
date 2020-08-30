import {
  StrictDrawingInterface as StrictDrawing,
  StrictDrawingSavableState,
} from './draw/StrictDrawingInterface';
import UndoRedo from './undo/UndoRedo';
import StrictDrawingInteraction from './draw/interact/StrictDrawingInteraction';
import * as React from 'react';

export interface FormFactory {
  (close?: () => void): React.ReactElement;
}

export interface AppInterface {
  readonly strictDrawing: StrictDrawing;
  readonly undoRedo: UndoRedo<StrictDrawingSavableState>;
  readonly strictDrawingInteraction: StrictDrawingInteraction;

  renderPeripherals(): void;
  renderForm(f: FormFactory): void;
  unmountCurrForm(): void;
  updateDocumentTitle(): void;
  drawingChangedNotByInteraction(): void;

  pushUndo(): void;
  canUndo(): boolean;
  undo(): void;
  canRedo(): boolean;
  redo(): void;

  save(): void;
}
