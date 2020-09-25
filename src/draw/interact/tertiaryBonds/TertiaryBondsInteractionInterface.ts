import { DrawingInterface as Drawing } from '../../DrawingInterface';

export interface TertiaryBondsInteractionInterface {
  readonly drawing: Drawing;

  hovered?: string;
  selected: Set<string>;

  dragging: boolean;
  dragged: boolean;

  fireShouldPushUndo(): void;
  fireChange(): void;
}
