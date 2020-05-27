import { PivotingModeInterface as PivotingMode } from './PivotingModeInterface';
import Base from '../../Base';
import removeAllBaseHighlightings from "../highlight/removeAllBaseHighlightings";

export function handleMouseoutOnBase(mode: PivotingMode, b: Base) {
  if (!mode.selectedPosition) {
    removeAllBaseHighlightings(mode.strictDrawing.drawing);
  }
}

export default handleMouseoutOnBase;
