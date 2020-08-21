import { StrictDrawingInterface as StrictDrawing } from './draw/StrictDrawingInterface';
import StrictDrawingInteraction from './draw/interact/StrictDrawingInteraction';
import * as React from 'react';

export interface FormFactory {
  (close?: () => void): React.ReactElement;
}

export interface AppInterface {
  readonly strictDrawing: StrictDrawing;
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
