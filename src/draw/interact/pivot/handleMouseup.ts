import { PivotingModeInterface as PivotingMode } from './PivotingModeInterface';
import removeAllBaseHighlightings from '../highlight/removeAllBaseHighlightings';

function handleMouseup(mode: PivotingMode) {
  if (mode.disabled()) {
    return;
  }
  mode.selectedPosition = null;
  removeAllBaseHighlightings(mode.strictDrawing.drawing);
}

export default handleMouseup;
