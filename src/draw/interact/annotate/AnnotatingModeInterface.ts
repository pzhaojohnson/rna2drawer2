import { DrawingInterface as Drawing } from "../../DrawingInterface";

export interface AnnotatingModeInterface {
  hovered?: number;
  selected: Set<number>;
  selectingFrom?: number;

  readonly drawing: Drawing;
}

export default AnnotatingModeInterface;
