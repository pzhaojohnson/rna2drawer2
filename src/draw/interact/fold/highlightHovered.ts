import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import highlightBase from '../highlight/highlightBase';
import basesInRange from './basesInRange';
import selectedAreSecondaryUnpaired from './selectedAreSecondaryUnpaired';
import {
  hoveredComplement,
  Complement,
} from './hoveredComplement';

function _highlightUnpair(mode: FoldingMode) {
  let r = {
    position5: mode.minSelected as number,
    position3: mode.maxSelected as number,
  };
  basesInRange(mode, r).forEach(b => {
    highlightBase(b, {
      fill: '#ff0000',
      fillOpacity: 1,
    });
  });
}

function _highlightPair(mode: FoldingMode, c: Complement) {
  basesInRange(mode, c).forEach(b => {
    highlightBase(b, {
      fill: '#aea1ff',
      fillOpacity: 0.75,
    });
  });
}

function _highlightSelect(mode: FoldingMode) {
  let drawing = mode.strictDrawing.drawing;
  let b = drawing.getBaseAtOverallPosition(mode.hovered as number);
  if (b) {
    highlightBase(b, {
      fill: '#fcdc00',
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
      _highlightUnpair(mode);
    }
    return;
  }
  let c = hoveredComplement(mode);
  if (c) {
    _highlightPair(mode, c);
    return;
  }
  _highlightSelect(mode);
}

export default highlightHovered;
