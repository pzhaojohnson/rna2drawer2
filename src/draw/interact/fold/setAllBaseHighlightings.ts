import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import removeAllBaseHighlightings from '../highlight/removeAllBaseHighlightings';
import highlightSelected from './highlightSelected';
import highlightComplements from './highlightComplements';
import highlightHovered from './highlightHovered';

export function setAllBaseHighlightings(mode: FoldingMode) {
  removeAllBaseHighlightings(mode.strictDrawing.drawing);
  highlightSelected(mode);
  highlightComplements(mode);
  highlightHovered(mode);
}

export default setAllBaseHighlightings;
