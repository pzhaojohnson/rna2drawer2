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
        stroke: '#051094',
        strokeOpacity: 0.25,
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
        strokeOpacity: 0.75,
      };
    });
  }
}

let selectProps = { stroke: '#fcdc00', strokeOpacity: 0.75 };
let pairProps = { stroke: '#000080', strokeOpacity: 0.75, fill: '#000080', fillOpacity: 0.25 };
let unpairProps = { stroke: '#ff0000', strokeOpacity: 0.75, fill: '#ff0000', fillOpacity: 0.5 };

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
      if (!b.highlighting || b.highlighting.stroke != props.stroke) {
        let radius = 0.85 * b.fontSize;
        if (b.outline) {
          radius = Math.max(radius, 1.15 * (b.outline.radius + b.outline.strokeWidth));
        }
        let h = highlightBase(b, {
          ...props,
          radius: radius,
          fill: props.fill ?? '#00ffff',
          fillOpacity: props.fillOpacity ?? 0,
          strokeWidth: 1.5,
        });
        h.pulsateBetween({
          radius: 1.25 * radius,
          strokeOpacity: props.strokeOpacity == undefined ? 0.5 : 0.5 * props.strokeOpacity,
          fillOpacity: props.fillOpacity == undefined ? 0 : 0.5 * props.fillOpacity,
        }, { duration: 750 });
      }
    } else {
      b.removeHighlighting();
    }
  });
}

export default setAllBaseHighlightings;
