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
    }
    setAllBaseHighlightings(mode);
  }
}

export function handleMouseoutOnBase(mode: AnnotatingMode, b: Base) {
  mode.hovered = undefined;
  setAllBaseHighlightings(mode);
}

export function handleMousedownOnBase(mode: AnnotatingMode, b: Base) {
  let p = mode.drawing.overallPositionOfBase(b);
  if (p != 0) {
    mode.selected.add(p);
    mode.selectingFrom = p;
    setAllBaseHighlightings(mode);
  }
}

export function handleMousedownOnDrawing(mode: AnnotatingMode) {
  mode.selected = new Set<number>();
  setAllBaseHighlightings(mode);
}

export function handleMouseup(mode: AnnotatingMode) {
  mode.selectingFrom = undefined;
}

export function reset(mode: AnnotatingMode) {
  mode.hovered = undefined;
  mode.selected = new Set<number>();
  mode.selectingFrom = undefined;
  setAllBaseHighlightings(mode);
}
