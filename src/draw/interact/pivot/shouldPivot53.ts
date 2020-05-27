import { PivotingModeInterface as PivotingMode } from './PivotingModeInterface';
import normalizeAngle from "../../normalizeAngle";

export interface Stem {
  position5: number;
  position3: number;
}

export function shouldPivot53(mode: PivotingMode, selectedStem: Stem, xMove: number, yMove: number): boolean {
  let drawing = mode.strictDrawing.drawing;
  let b5 = drawing.getBaseAtOverallPosition(selectedStem.position5);
  let b3 = drawing.getBaseAtOverallPosition(selectedStem.position3);
  let ba = b5.angleBetweenCenters(b3);
  let ma = Math.atan2(yMove, xMove);
  ma = normalizeAngle(ma, ba);
  return ma - ba < Math.PI / 2 || ma - ba > 3 * Math.PI / 2;
}

export default shouldPivot53;
