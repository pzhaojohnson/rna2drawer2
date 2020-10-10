import { PivotingModeInterface as PivotingMode } from './PivotingModeInterface';
import { BaseInterface as Base } from '../../BaseInterface';
import { stemOfPosition } from '../../../parse/stemOfPosition';
import { highlightStem } from './highlight';
import { removeAllBaseHighlightings } from '../highlight/removeAllBaseHighlightings';
import { pivot } from './pivot';

export function handleMouseoverOnBase(mode: PivotingMode, b: Base) {
  let p = mode.strictDrawing.drawing.overallPositionOfBase(b);
  if (p > 0) {
    let st = stemOfPosition(p, mode.strictDrawing.layoutPartners());
    if (st) {
      mode.hovered = st;
      highlightStem(mode, st);
    }
  }
}

export function handleMouseoutOnBase(mode: PivotingMode, b: Base) {
  mode.hovered = undefined;
  if (!mode.selected) {
    removeAllBaseHighlightings(mode.strictDrawing.drawing);
  }
}

export function handleMousedownOnBase(mode: PivotingMode, b: Base) {
  if (mode.hovered) {
    mode.selected = mode.hovered;
    mode.pivoted = false;
    mode.fireChange();
  }
}

export function handleMousemove(mode: PivotingMode, event: MouseEvent, movement: { x: number, y: number }) {
  if (mode.enabled()) {
    if (mode.selected) {
      if (!mode.pivoted) {
        mode.fireShouldPushUndo();
      }
      pivot(mode, movement);
      mode.pivoted = true;
      mode.fireChange();
    }
  }
}

export function handleMouseup(mode: PivotingMode) {
  if (mode.enabled()) {
    if (mode.selected) {
      mode.selected = undefined;
      removeAllBaseHighlightings(mode.strictDrawing.drawing);
    }
  }
}

export function reset(mode: PivotingMode) {
  mode.hovered = undefined;
  mode.selected = undefined;
  removeAllBaseHighlightings(mode.strictDrawing.drawing);
  mode.fireChange();
}
