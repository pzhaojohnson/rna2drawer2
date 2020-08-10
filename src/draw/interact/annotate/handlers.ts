import { AnnotatingModeInterface as AnnotatingMode } from './AnnotatingModeInterface';
import { BaseInterface as Base } from '../../BaseInterface';
import setAllBaseHighlightings from './setAllBaseHighlightings';

export function handleMouseoverOnBase(mode: AnnotatingMode, b: Base) {
  let p = mode.drawing.overallPositionOfBase(b);
  if (p != 0) {
    mode.hovered = p;
    if (mode.selectingFrom) {
      let min = Math.min(p, mode.selectingFrom);
      let max = Math.max(p, mode.selectingFrom);
      for (let q = min; q <= max; q++) {
        mode.selected.add(q);
      }
      mode.requestToRenderForm();
    }
    setAllBaseHighlightings(mode);
  }
}

export function handleMouseoutOnBase(mode: AnnotatingMode, b: Base) {
  mode.hovered = undefined;
  setAllBaseHighlightings(mode);
}

export function handleMousedownOnBase(mode: AnnotatingMode, b: Base) {
  if (mode.hovered) {
    if (mode.selected.has(mode.hovered)) {
      mode.selected.delete(mode.hovered);
      setAllBaseHighlightings(mode);
      b.removeHighlighting();
    } else {
      mode.selected.add(mode.hovered);
      mode.selectingFrom = mode.hovered;
      setAllBaseHighlightings(mode);
    }
    mode.requestToRenderForm();
  }
}

export function handleMousedownOnDrawing(mode: AnnotatingMode) {
  if (!mode.hovered) {
    mode.selected = new Set<number>();
    setAllBaseHighlightings(mode);
    mode.requestToRenderForm();
  }
}

export function handleMouseup(mode: AnnotatingMode) {
  if (mode.enabled()) {
    mode.selectingFrom = undefined;
  }
}

export function reset(mode: AnnotatingMode) {
  mode.hovered = undefined;
  mode.selected = new Set<number>();
  mode.selectingFrom = undefined;
  setAllBaseHighlightings(mode);
}
