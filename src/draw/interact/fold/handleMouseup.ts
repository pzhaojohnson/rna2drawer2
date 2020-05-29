import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import setAllBaseHighlightings from './setAllBaseHighlightings';

export function handleMouseup(mode: FoldingMode) {
  if (mode.disabled()) {
    return;
  }
  mode.selecting = false;
  setAllBaseHighlightings(mode);
}

export default handleMouseup;
