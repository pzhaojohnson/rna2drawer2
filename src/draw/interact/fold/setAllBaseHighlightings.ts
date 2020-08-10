import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import highlightBase, { HighlightingProps } from '../highlight/highlightBase';
import allPairables from './allPairables';
import { selectedRange } from './selected';
import secondaryBondsWith from './secondaryBondsWith';
import hoveredPairable from './hoveredPairable';

function _highlightPairables(mode: FoldingMode, highlightings: HighlightingProps[]) {
  let pairables = allPairables(mode);
  pairables.forEach(r => {
    r.fromStartToEnd(p => {
      highlightings[p - 1] = {
        stroke: '#aea1ff',
      };
    });
  });
}

function _highlightSelected(mode: FoldingMode, highlightings: HighlightingProps[]) {
  let rSelected = selectedRange(mode);
  if (rSelected) {
    rSelected.fromStartToEnd(p => {
      highlightings[p - 1] = {
        stroke: '#fcdc00',
      };
    });
  }
}

let selectProps = { stroke: '#fcdc00' };
let pairProps = { stroke: '#aea1ff'};
let unpairProps = { stroke: '#ff0000' };

function _highlightHovered(mode: FoldingMode, highlightings: HighlightingProps[]) {
  let hovered = mode.hovered;
  if (typeof hovered != 'number') {
    return;
  }
  let rSelected = selectedRange(mode);
  let pairable = hoveredPairable(mode);
  if (rSelected && rSelected.contains(hovered)) {
    if (secondaryBondsWith(mode, rSelected).length > 0 && !mode.onlyAddingTertiaryBonds()) {
      rSelected.fromStartToEnd(p => highlightings[p - 1] = { ...unpairProps });
    }
  } else if (pairable) {
    pairable.fromStartToEnd(p => highlightings[p - 1] = { ...pairProps });
  } else {
    highlightings[hovered - 1] = { ...selectProps };
  }
}

export function setAllBaseHighlightings(mode: FoldingMode) {
  let highlightings = [] as HighlightingProps[];
  if (mode.pairingComplements()) {
    _highlightPairables(mode, highlightings);
  }
  _highlightSelected(mode, highlightings);
  _highlightHovered(mode, highlightings);
  mode.strictDrawing.drawing.forEachBase((b, p) => {
    let props = highlightings[p - 1];
    if (props) {
      let radius = b.fontSize;
      if (b.outline) {
        radius = Math.max(radius, 1.1 * (b.outline.radius + b.outline.strokeWidth));
      }
      let h = highlightBase(b, {
        ...props,
        radius: radius,
        fillOpacity: 0,
        strokeWidth: 1.25,
        strokeOpacity: 1,
      });
      h.pulsateBetween({
        radius: 1.35 * radius,
        strokeOpacity: 0.5,
      }, { duration: 750 });
    } else {
      b.removeHighlighting();
    }
  });
}

export default setAllBaseHighlightings;
