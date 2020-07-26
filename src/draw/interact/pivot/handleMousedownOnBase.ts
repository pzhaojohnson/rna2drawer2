import { PivotingModeInterface as PivotingMode } from './PivotingModeInterface';
import Base from '../../Base';

function handleMousedownOnBase(mode: PivotingMode, b: Base) {
  let p = mode.strictDrawing.drawing.overallPositionOfBase(b);
  mode.selectedPosition = p;
  mode.pivoted = false;
}

export default handleMousedownOnBase;
