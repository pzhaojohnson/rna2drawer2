import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import setAllBaseHighlightings from './setAllBaseHighlightings';

export function handleMouseup(mode: FoldingMode) {
  if (mode.disabled()) {
    return;
  }
  mode.stopSelecting();
  setAllBaseHighlightings(mode);
}

export default handleMouseup;
