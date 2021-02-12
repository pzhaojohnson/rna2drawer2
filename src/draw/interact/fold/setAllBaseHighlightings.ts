import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import highlightBase, { HighlightingProps } from '../highlight/highlightBase';
import allPairables from './allPairables';
import { selectedRange } from './selected';
import secondaryBondsWith from './secondaryBondsWith';
import hoveredPairable from './hoveredPairable';
import { BaseInterface as Base } from '../../BaseInterface';

function _highlightPairables(mode: FoldingMode, highlightings: HighlightingProps[]) {
  let pairables = allPairables(mode);
  pairables.forEach(r => {
    r.fromStartToEnd(p => {
      highlightings[p - 1] = {
        stroke: '#0047ab',
        strokeOpacity: 0.85,
      };
    });
  });
}

let selectedProps = { stroke: '#ffbf00', strokeOpacity: 0.85 };

function _highlightSelected(mode: FoldingMode, highlightings: HighlightingProps[]) {
  let rSelected = selectedRange(mode);
  if (rSelected) {
    rSelected.fromStartToEnd(p => {
      highlightings[p - 1] = { ...selectedProps };
    });
  }
}

let pairProps = { stroke: '#ff0080', strokeOpacity: 0.85, strokeWidth: 2.25 };
let unpairProps = { stroke: '#ff0000', strokeOpacity: 0.85, strokeWidth: 2.25 };

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
    highlightings[hovered - 1] = { ...selectedProps };
  }
}

export function setAllBaseHighlightings(mode: FoldingMode) {
  let highlightings = [] as HighlightingProps[];
  if (mode.pairingComplements() && !mode.selecting) {
    _highlightPairables(mode, highlightings);
  }
  _highlightSelected(mode, highlightings);
  _highlightHovered(mode, highlightings);
  let drawing = mode.strictDrawing.drawing;
  let bHovered = undefined as Base | undefined;
  if (typeof mode.hovered == 'number') {
    bHovered = drawing.getBaseAtOverallPosition(mode.hovered);
  }
  mode.strictDrawing.drawing.forEachBase((b, p) => {
    let props = highlightings[p - 1];
    if (props) {
      let radius = 0.85 * b.fontSize;
      if (b.outline) {
        radius = Math.max(radius, 1.15 * (b.outline.radius + b.outline.strokeWidth));
      }
      if (!b.highlighting || b.highlighting.stroke != props.stroke) {
        let h = highlightBase(b, {
          ...props,
          radius: radius,
          fill: 'none',
          strokeWidth: props.strokeWidth ?? 1.5,
        });
        h.pulsateBetween({
          radius: 1.5 * radius,
          strokeOpacity: props.strokeOpacity == undefined ? 0.25 : 0.25 * props.strokeOpacity,
        }, { duration: 1000 });
      }
      if (bHovered && bHovered.distanceBetweenCenters(b) < 5 * radius) {
        if (b.highlighting) {
          b.highlighting.sendToBack();
        }
      }
    } else {
      b.removeHighlighting();
    }
  });
}

export default setAllBaseHighlightings;
