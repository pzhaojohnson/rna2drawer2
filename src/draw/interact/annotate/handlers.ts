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
    mode.fireChange();
  }
}

export function handleMouseoutOnBase(mode: AnnotatingMode, b: Base) {
  mode.hovered = undefined;
  setAllBaseHighlightings(mode);
  mode.fireChange();
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
    mode.fireChange();
  }
}

export function handleMousedownOnDrawing(mode: AnnotatingMode) {
  if (!mode.hovered) {
    mode.selected = new Set<number>();
    setAllBaseHighlightings(mode);
    mode.fireChange();
  }
}

export function handleMouseup(mode: AnnotatingMode) {
  if (mode.enabled()) {
    mode.selectingFrom = undefined;
  }
}

export function refresh(mode: AnnotatingMode) {
  if (typeof mode.hovered == 'number' && mode.hovered > mode.drawing.numBases) {
    mode.hovered = undefined;
  }
  let toDeselect = [] as number[];
  mode.selected.forEach(p => {
    if (p > mode.drawing.numBases) {
      toDeselect.push(p);
    }
  });
  toDeselect.forEach(p => mode.selected.delete(p));
  if (typeof mode.selectingFrom == 'number' && mode.selectingFrom > mode.drawing.numBases) {
    mode.selectingFrom = undefined;
  }
  setAllBaseHighlightings(mode);
}

export function reset(mode: AnnotatingMode) {
  mode.hovered = undefined;
  mode.selected = new Set<number>();
  mode.selectingFrom = undefined;
  setAllBaseHighlightings(mode);
  mode.fireChange();
}
