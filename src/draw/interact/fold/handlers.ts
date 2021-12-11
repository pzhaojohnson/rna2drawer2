import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import setAllBaseHighlightings from './setAllBaseHighlightings';
import { removeAllBaseHighlightings } from 'Draw/interact/highlight/removeAllBaseHighlightings';
import { Base } from 'Draw/bases/Base';
import { selectedRange } from './selected';
import hoveredPairable from './hoveredPairable';
import secondaryBondsWith from './secondaryBondsWith';
import unpair from './unpair';
import pair from './pair';

export function handleMouseoverOnBase(mode: FoldingMode, b: Base) {
  let drawing = mode.strictDrawing.drawing;
  let p = drawing.overallPositionOfBase(b);
  mode.hovered = p;
  if (mode.selected && mode.selecting) {
    mode.selected.looseEnd = p;
  }
  setAllBaseHighlightings(mode);
}

export function handleMouseoutOnBase(mode: FoldingMode, b: Base) {
  mode.hovered = undefined;
  setAllBaseHighlightings(mode);
}

export function handleMousedownOnBase(mode: FoldingMode, b: Base) {
  if (typeof mode.hovered != 'number') {
    return;
  }
  let rSelected = selectedRange(mode);
  let pairable = hoveredPairable(mode);
  if (rSelected && rSelected.contains(mode.hovered)) {
    if (secondaryBondsWith(mode, rSelected).length > 0 && !mode.onlyAddingTertiaryBonds()) {
      unpair(mode);
    }
  } else if (pairable) {
    pair(mode);
  } else {
    mode.selected = {
      tightEnd: mode.hovered,
      looseEnd: mode.hovered,
    };
    mode.selecting = true;
    setAllBaseHighlightings(mode);
  }
  mode.fireChange();
}

export function handleMousedownOnDrawing(mode: FoldingMode) {
  if (!mode.deselectingOnDblclick && typeof mode.hovered != 'number') {
    mode.reset();
  }
}

export function handleDblclickOnDrawing(mode: FoldingMode) {
  if (mode.deselectingOnDblclick && typeof mode.hovered != 'number') {
    mode.reset();
  }
}

export function handleMouseup(mode: FoldingMode) {
  if (mode.disabled()) {
    return;
  }
  mode.selecting = false;
  setAllBaseHighlightings(mode);
}

export function refresh(mode: FoldingMode) {
  let seq = mode.strictDrawing.layoutSequence();

  if (seq.length == 0) {
    reset(mode);
    return;
  }

  if (typeof mode.hovered == 'number' && mode.hovered > seq.length) {
    mode.hovered = undefined;
  }
  if (mode.selected) {
    if (mode.selected.tightEnd > seq.length || mode.selected.looseEnd > seq.length) {
      mode.selected = undefined;
    }
  }
  mode.selecting = false;
  removeAllBaseHighlightings(mode.strictDrawing.drawing); // needed to restart animations
  setAllBaseHighlightings(mode);
  mode.fireChange();
}

export function reset(mode: FoldingMode) {
  mode.hovered = undefined;
  mode.selected = undefined;
  mode.selecting = false;
  setAllBaseHighlightings(mode);
  mode.fireChange();
}
