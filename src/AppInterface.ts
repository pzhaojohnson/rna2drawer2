import {
  StrictDrawingInterface as StrictDrawing,
  StrictDrawingSavableState,
} from 'Draw/strict/StrictDrawingInterface';
import UndoRedo from './undo/UndoRedo';
import StrictDrawingInteraction from './draw/interact/StrictDrawingInteraction';
import * as React from 'react';

export interface FormFactory {
  (close: () => void): React.ReactElement;
}

export interface AppInterface {

  // the underlying DOM node of the app
  // (can be added to and removed from containers
  // to add and remove the app from containers)
  readonly node: Node;

  readonly strictDrawing: StrictDrawing;
  readonly undoRedo: UndoRedo<StrictDrawingSavableState>;
  readonly strictDrawingInteraction: StrictDrawingInteraction;

  appendTo(container: Node): void;

  renderPeripherals(): void;
  renderForm(formFactory: FormFactory): void;
  unmountForm(): void;

  unspecifiedDrawingTitle(): string; // all sequence IDs joined by commas
  drawingTitle: string;
  unspecifyDrawingTitle(): void;

  updateDocumentTitle(): void;
  refresh(): void;

  pushUndo(): void;
  canUndo(): boolean;
  undo(): void;
  canRedo(): boolean;
  redo(): void;
}
