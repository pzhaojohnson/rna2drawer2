import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import highlightBase from '../highlight/highlightBase';
import { pulsateBetween } from 'Draw/interact/highlight/pulse';
import { removeCircleHighlighting } from 'Draw/bases/annotate/circle/add';
import allPairables from './allPairables';
import { selectedRange } from './selected';
import secondaryBondsWith from './secondaryBondsWith';
import hoveredPairable from './hoveredPairable';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { isPoint2D as isPoint } from 'Math/Point';
import { distance2D as distance } from 'Math/distance';
import {
  sendToBack as sendHighlightingToBack,
} from 'Draw/bases/annotate/circle/z';

function areWithin(b1: Base, b2: Base, radius: number): boolean {
  // faster to use x and y coordinates than to retrieve center coordinates
  let p1 = { x: b1.text.attr('x'), y: b1.text.attr('y') };
  let p2 = { x: b2.text.attr('x'), y: b2.text.attr('y') };
  if (isPoint(p1) && isPoint(p2)) {
    return distance(p1.x, p1.y, p2.x, p2.y) <= radius;
  }
  return false;
}

interface HighlightingProps {
  unpulsed: {
    stroke: string;
    strokeWidth: number;
    strokeOpacity: number;
  }
  pulse: {
    scaling: number;
    duration: number;
  }
  pulsed: {
    strokeWidth: number;
    strokeOpacity: number;
  }
}

let unpulsedProps = {
  pairable: {
    stroke: '#0010f3',
    strokeWidth: 1.5,
    strokeOpacity: 1,
  },
  selected: {
    stroke: '#ffcc00',
    strokeWidth: 1.5,
    strokeOpacity: 1,
  },
  pair: {
    stroke: '#ff00e0',
    strokeWidth: 1.5,
    strokeOpacity: 1,
  },
  unpair: {
    stroke: '#ff1106',
    strokeWidth: 1.5,
    strokeOpacity: 1,
  },
};

let pulseProps = {
  pairable: {
    scaling: 1.2,
    duration: 875,
  },
  selected: {
    scaling: 1.1,
    duration: 1000,
  },
  pair: {
    scaling: 1.1,
    duration: 1000,
  },
  unpair: {
    scaling: 1.1,
    duration: 625,
  },
};

let pulsedProps = {
  pairable: {
    strokeWidth: pulseProps.pairable.scaling * unpulsedProps.pairable.strokeWidth,
    strokeOpacity: 0.05,
  },
  selected: {
    strokeWidth: pulseProps.selected.scaling * unpulsedProps.selected.strokeWidth,
    strokeOpacity: 0.9,
  },
  pair: {
    strokeWidth: pulseProps.pair.scaling * unpulsedProps.pair.strokeWidth,
    strokeOpacity: 0.9,
  },
  unpair: {
    strokeWidth: pulseProps.unpair.scaling * unpulsedProps.unpair.strokeWidth,
    strokeOpacity: 0.9,
  },
};

let highlightingProps = {
  pairable: {
    unpulsed: { ...unpulsedProps.pairable },
    pulse: { ...pulseProps.pairable },
    pulsed: { ...pulsedProps.pairable },
  },
  selected: {
    unpulsed: { ...unpulsedProps.selected },
    pulse: { ...pulseProps.selected },
    pulsed: { ...pulsedProps.selected },
  },
  pair: {
    unpulsed: { ...unpulsedProps.pair },
    pulse: { ...pulseProps.pair },
    pulsed: { ...pulsedProps.pair },
  },
  unpair: {
    unpulsed: { ...unpulsedProps.unpair },
    pulse: { ...pulseProps.unpair },
    pulsed: { ...pulsedProps.unpair },
  },
};

function _highlightPairables(mode: FoldingMode, highlightings: HighlightingProps[]) {
  let pairables = allPairables(mode);
  pairables.forEach(r => {
    r.fromStartToEnd(p => {
      highlightings[p - 1] = { ...highlightingProps.pairable };
    });
  });
}

function _highlightSelected(mode: FoldingMode, highlightings: HighlightingProps[]) {
  let rSelected = selectedRange(mode);
  if (rSelected) {
    rSelected.fromStartToEnd(p => {
      highlightings[p - 1] = { ...highlightingProps.selected };
    });
  }
}

function _highlightHovered(mode: FoldingMode, highlightings: HighlightingProps[]) {
  let hovered = mode.hovered;
  if (typeof hovered != 'number') {
    return;
  }
  let rSelected = selectedRange(mode);
  let pairable = hoveredPairable(mode);
  if (rSelected && rSelected.contains(hovered)) {
    if (secondaryBondsWith(mode, rSelected).length > 0 && !mode.onlyAddingTertiaryBonds()) {
      rSelected.fromStartToEnd(p => highlightings[p - 1] = { ...highlightingProps.unpair });
    }
  } else if (pairable) {
    pairable.fromStartToEnd(p => highlightings[p - 1] = { ...highlightingProps.pair });
  } else {
    highlightings[hovered - 1] = { ...highlightingProps.selected };
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
      let fs = b.text.attr('font-size');
      let radius = typeof fs == 'number' ? fs : 9;
      if (b.outline) {
        let outlineRadius = b.outline.circle.attr('r');
        let outlineStrokeWidth = b.outline.circle.attr('stroke-width');
        if (typeof outlineRadius == 'number' && typeof outlineStrokeWidth == 'number') {
          radius = Math.max(radius, 1.25 * (outlineRadius + outlineStrokeWidth));
        }
      }
      if (!b.highlighting || b.highlighting.circle.attr('stroke') != props.unpulsed.stroke) {
        if (b.highlighting && b.highlighting.circle.attr('stroke') != props.unpulsed.stroke) {
          // seems impossible to edit an animated SVG element
          removeCircleHighlighting(b);
        }
        let h = highlightBase(b, {
          radius: radius,
          stroke: props.unpulsed.stroke,
          strokeWidth: props.unpulsed.strokeWidth,
          strokeOpacity: props.unpulsed.strokeOpacity,
          fill: 'none',
        });
        if (h) {
          pulsateBetween(h, {
            radius: props.pulse.scaling * radius,
            strokeWidth: props.pulsed.strokeWidth,
            strokeOpacity: props.pulsed.strokeOpacity,
          }, { duration: props.pulse.duration });
        }
      }
      if (bHovered && areWithin(bHovered, b, 5 * radius)) {
        if (b.highlighting) {
          sendHighlightingToBack(b.highlighting);
        }
      }
    } else {
      removeCircleHighlighting(b);
    }
  });
}

export default setAllBaseHighlightings;
