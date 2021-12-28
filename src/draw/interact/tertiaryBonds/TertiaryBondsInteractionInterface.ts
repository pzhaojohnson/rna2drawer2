import { DrawingInterface as Drawing } from '../../DrawingInterface';
import { FormFactory } from 'AppInterface';

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
