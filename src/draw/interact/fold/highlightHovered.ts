import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import highlightBase from '../highlight/highlightBase';
import basesInRange from './basesInRange';
import selectedAreSecondaryUnpaired from './selectedAreSecondaryUnpaired';
import {
  hoveredComplement,
  Complement,
} from './hoveredComplement';

function highlightUnpair(mode: FoldingMode) {
  let r = {
    position5: mode.minSelected,
    position3: mode.maxSelected,
  };
  basesInRange(mode, r).forEach(b => {
    highlightBase(b, {
      fill: '#ff0000',
      fillOpacity: 1,
    });
  });
}

function highlightPair(mode: FoldingMode, c: Complement) {
  basesInRange(mode, c).forEach(b => {
    highlightBase(b, {
      fill: '#0000ff',
      fillOpacity: 0.45,
    });
  });
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
    if (!selectedAreSecondaryUnpaired(mode) && !mode.selecting) {
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
