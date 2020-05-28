import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import highlightBase from '../highlight/highlightBase';
import selectedAreUnpaired from './selectedAreUnpaired';
import {
  hoveredComplement,
  Complement,
} from './hoveredComplement';

function highlightUnpair(mode: FoldingMode) {
  let drawing = mode.strictDrawing.drawing;
  for (let p = mode.minSelected; p <= mode.maxSelected; p++) {
    let b = drawing.getBaseAtOverallPosition(p);
    if (b) {
      highlightBase(b, {
        fill: '#ff0000',
        fillOpacity: 1,
      });
    }
  }
}

function highlightPair(mode: FoldingMode, c: Complement) {
  let drawing = mode.strictDrawing.drawing;
  for (let p = c.position5; p <= c.position3; p++) {
    let b = drawing.getBaseAtOverallPosition(p);
    if (b) {
      highlightBase(b, {
        fill: '#0000ff',
        fillOpacity: 0.45,
      });
    }
  }
}

function highlightSelect(mode: FoldingMode) {
  let drawing = mode.strictDrawing.drawing;
  let b = drawing.getBaseAtOverallPosition(mode.hovered);
  if (b) {
    highlightBase(b, {
      fill: '#ffd700',
      fillOpacity: 0.75,
    });
  }
}

export function highlightHovered(mode: FoldingMode) {
  if (!mode.hovered) {
    return;
  }
  if (mode.hoveringSelected()) {
    if (!selectedAreUnpaired(mode) && !mode.selecting()) {
      highlightUnpair(mode);
    }
    return;
  }
  let c = hoveredComplement(mode);
  if (c) {
    highlightPair(mode, c);
    return;
  }
  highlightSelect(mode);
}

export default highlightHovered;
