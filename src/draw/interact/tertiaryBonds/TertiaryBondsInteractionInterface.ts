import { DrawingInterface as Drawing } from '../../DrawingInterface';

export interface FormFactory {
  (close?: () => void): React.ReactElement;
}

export interface TertiaryBondsInteractionInterface {
  readonly drawing: Drawing;

  hovered?: string;
  selected: Set<string>;

  dragging: boolean;
  dragged: boolean;

  fireShouldPushUndo(): void;
  fireChange(): void;

  onRequestToRenderForm(f: (ff: FormFactory) => void): void;
  requestToRenderForm(): void;
}
