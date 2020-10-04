import { StrictDrawingInterface as StrictDrawing } from '../../StrictDrawingInterface';

export interface FlippingModeInterface {
  readonly className: 'FlippingMode';

  readonly strictDrawing: StrictDrawing;

  hovered?: number;

  disable(): void;
  enable(): void;

  onChange(f: () => void): void;
  fireChange(): void;
  onShouldPushUndo(f: () => void): void;
  fireShouldPushUndo(): void;
}
