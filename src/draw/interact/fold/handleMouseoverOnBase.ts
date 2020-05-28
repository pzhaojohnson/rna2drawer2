import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import Base from '../../Base';
import setAllBaseHighlightings from './setAllBaseHighlightings';

export function handleMouseoverOnBase(mode: FoldingMode, b: Base) {
  let drawing = mode.strictDrawing.drawing;
  let p = drawing.overallPositionOfBase(b);
  mode.hovered = p;
  if (mode.selecting()) {
    mode.selected.looseEnd = p;
  }
  setAllBaseHighlightings(mode);
}

export default handleMouseoverOnBase;
