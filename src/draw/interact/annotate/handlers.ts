import { AnnotatingModeInterface as AnnotatingMode } from './AnnotatingModeInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import setAllBaseHighlightings from './setAllBaseHighlightings';
import removeAllBaseHighlightings from '../highlight/removeAllBaseHighlightings';
import { removeCircleHighlighting } from 'Draw/bases/annotate/circle/add';
import positionsBetween from './positionsBetween';

export function handleMouseoverOnBase(mode: AnnotatingMode, b: Base) {
  let p = mode.strictDrawing.drawing.overallPositionOfBase(b);
  if (p != 0) {
    mode.hovered = p;
    if (mode.selectingFrom) {
      positionsBetween(p, mode.selectingFrom).forEach(q => mode.selected.add(q));
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
      removeCircleHighlighting(b); // remove highlighting from hovering
    } else {
      mode.selected.add(mode.hovered);
      mode.selectingFrom = mode.hovered;
      setAllBaseHighlightings(mode);
      mode.requestToRenderForm();
    }
    mode.fireChange();
  }
}

export function handleMousedownOnDrawing(mode: AnnotatingMode) {
  if (!mode.deselectingOnDblclick && !mode.hovered) {
    clearSelection(mode);
  }
}

export function handleDblclickOnDrawing(mode: AnnotatingMode) {
  if (mode.deselectingOnDblclick && !mode.hovered) {
    clearSelection(mode);
  }
}

export function handleMouseup(mode: AnnotatingMode) {
  if (mode.enabled()) {
    mode.selectingFrom = undefined;
  }
}

export function select(mode: AnnotatingMode, ps: number[]) {
  clearSelection(mode);
  ps.forEach(p => mode.selected.add(p));
  setAllBaseHighlightings(mode);
  mode.fireChange();
  mode.requestToRenderForm();
}

export function clearSelection(mode: AnnotatingMode) {
  mode.selected = new Set<number>();
  setAllBaseHighlightings(mode);
  mode.fireChange();
}

export function refresh(mode: AnnotatingMode) {
  if (typeof mode.hovered == 'number' && mode.hovered > mode.strictDrawing.drawing.numBases) {
    mode.hovered = undefined;
  }
  let toDeselect = [] as number[];
  mode.selected.forEach(p => {
    if (p > mode.strictDrawing.drawing.numBases) {
      toDeselect.push(p);
    }
  });
  toDeselect.forEach(p => mode.selected.delete(p));
  if (typeof mode.selectingFrom == 'number' && mode.selectingFrom > mode.strictDrawing.drawing.numBases) {
    mode.selectingFrom = undefined;
  }
  removeAllBaseHighlightings(mode.strictDrawing.drawing); // required to restart animations
  setAllBaseHighlightings(mode);
}

export function reset(mode: AnnotatingMode) {
  mode.hovered = undefined;
  mode.selected = new Set<number>();
  mode.selectingFrom = undefined;
  setAllBaseHighlightings(mode);
  mode.fireChange();
}
