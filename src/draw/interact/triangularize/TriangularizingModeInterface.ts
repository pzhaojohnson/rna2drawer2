import { StrictDrawingInterface as StrictDrawing } from '../../StrictDrawingInterface';

export interface TriangularizingModeInterface {
  readonly className: 'TriangularizingMode';

  readonly strictDrawing: StrictDrawing;

  hovered?: number;

  onShouldPushUndo(f: () => void): void;
  fireShouldPushUndo(): void;
  onChange(f: () => void): void;
  fireChange(): void;
}
