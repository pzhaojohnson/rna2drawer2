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
        fill: '#aea1ff',
        fillOpacity: 0.25,
      };
    });
  });
}

function _highlightSelected(mode: FoldingMode, highlightings: HighlightingProps[]) {
  let rSelected = selectedRange(mode);
  if (rSelected) {
    rSelected.fromStartToEnd(p => {
      highlightings[p - 1] = {
        fill: '#fcdc00',
        fillOpacity: 0.75,
      };
    });
  }
}

let selectProps = { fill: '#fcdc00', fillOpacity: 0.5 };
let pairProps = { fill: '#aea1ff', fillOpacity: 0.75 };
let unpairProps = { fill: '#ff0000', fillOpacity: 1 };

function _highlightHovered(mode: FoldingMode, highlightings: HighlightingProps[]) {
  let hovered = mode.hovered;
  if (typeof hovered != 'number') {
    return;
  }
  let rSelected = selectedRange(mode);
  let pairable = hoveredPairable(mode);
  if (rSelected && rSelected.contains(hovered)) {
    if (secondaryBondsWith(mode, rSelected).length > 0) {
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
  _highlightPairables(mode, highlightings);
  _highlightSelected(mode, highlightings);
  _highlightHovered(mode, highlightings);
  mode.strictDrawing.drawing.forEachBase((b, p) => {
    let props = highlightings[p - 1];
    if (props) {
      highlightBase(b, props);
    } else {
      b.removeHighlighting();
    }
  });
}

export default setAllBaseHighlightings;
