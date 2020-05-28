import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import highlightBase from '../highlight/highlightBase';

export function highlightSelected(mode: FoldingMode) {
  if (!mode.selected) {
    return;
  }
  let drawing = mode.strictDrawing.drawing;
  for (let p = mode.minSelected; p <= mode.maxSelected; p++) {
    let b = drawing.getBaseAtOverallPosition(p);
    if (b) {
      highlightBase(b, {
        fill: '#ffd700',
        fillOpacity: 0.75,
      });
    }
  }
}

export default highlightSelected;
