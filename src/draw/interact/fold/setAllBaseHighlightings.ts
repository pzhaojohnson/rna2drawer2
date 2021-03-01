import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import highlightBase from '../highlight/highlightBase';
import allPairables from './allPairables';
import { selectedRange } from './selected';
import secondaryBondsWith from './secondaryBondsWith';
import hoveredPairable from './hoveredPairable';
import { BaseInterface as Base } from '../../BaseInterface';

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
    strokeWidth: 1.275,
    strokeOpacity: 1,
  },
  selected: {
    stroke: '#ffd91e',
    strokeWidth: 1.275,
    strokeOpacity: 0.975,
  },
  pair: {
    stroke: '#ff00e0',
    strokeWidth: 1.275,
    strokeOpacity: 0.975,
  },
  unpair: {
    stroke: '#ff1106',
    strokeWidth: 1.275,
    strokeOpacity: 0.975,
  },
};

let pulseProps = {
  pairable: {
    scaling: 1.25,
    duration: 875,
  },
  selected: {
    scaling: 1.1075,
    duration: 1750,
  },
  pair: {
    scaling: 1.1075,
    duration: 1500,
  },
  unpair: {
    scaling: 1.1075,
    duration: 875,
  },
};

let pulsedProps = {
  pairable: {
    strokeWidth: pulseProps.pairable.scaling * unpulsedProps.pairable.strokeWidth,
    strokeOpacity: 0.05,
  },
  selected: {
    strokeWidth: pulseProps.selected.scaling * unpulsedProps.selected.strokeWidth,
    strokeOpacity: 0.825,
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
      let radius = b.fontSize;
      if (b.outline) {
        radius = Math.max(radius, 1.25 * (b.outline.radius + b.outline.strokeWidth));
      }
      if (!b.highlighting || b.highlighting.stroke != props.unpulsed.stroke) {
        let h = highlightBase(b, {
          radius: radius,
          stroke: props.unpulsed.stroke,
          strokeWidth: props.unpulsed.strokeWidth,
          strokeOpacity: props.unpulsed.strokeOpacity,
          fill: 'none',
        });
        h.pulsateBetween({
          radius: props.pulse.scaling * radius,
          strokeWidth: props.pulsed.strokeWidth,
          strokeOpacity: props.pulsed.strokeOpacity,
        }, { duration: props.pulse.duration });
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
