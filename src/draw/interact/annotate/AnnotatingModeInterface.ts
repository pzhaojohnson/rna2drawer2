import { DrawingInterface as Drawing } from "../../DrawingInterface";
import { BaseInterface as Base } from '../../BaseInterface';

export interface AnnotatingModeInterface {
  hovered?: number;
  selected: Set<number>;
  selectingFrom?: number;

  readonly className: string;

  readonly drawing: Drawing;

  handleMouseoverOnBase(b: Base): void;
  handleMouseoutOnBase(b: Base): void;
  handleMousedownOnBase(b: Base): void;
  handleMousedownOnDrawing(): void;
  reset(): void;

  disabled(): boolean;
  disable(): void;
  enabled(): boolean;
  enable(): void;

  onShouldPushUndo(f: () => void): void;
  fireShouldPushUndo(): void;
  onChange(f: () => void): void;
  fireChange(): void;
}

export default AnnotatingModeInterface;
