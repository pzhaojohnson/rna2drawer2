import { PivotingModeInterface as PivotingMode } from './PivotingModeInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { containingStem } from 'Partners/containing';
import { highlightStem } from './highlight';
import { removeAllBaseHighlightings } from '../highlight/removeAllBaseHighlightings';
import { pivot } from './pivot';
import { updateEntireLayout } from './updateEntireLayout';
import { closestBasesTo } from './closestBasesTo';
import { overallPositionsOfBases } from './overallPositionsOfBases';

export function handleMouseoverOnBase(mode: PivotingMode, b: Base) {
  let p = mode.strictDrawing.drawing.overallPositionOfBase(b);
  if (p > 0) {
    let st = containingStem(mode.strictDrawing.layoutPartners(), p);
    if (st && !mode.selected) {
      mode.hovered = st;
      mode.hoveredPosition = p;
      highlightStem(mode, st);
    }
  }
}

export function handleMouseoutOnBase(mode: PivotingMode, b: Base) {
  mode.hovered = undefined;
  mode.hoveredPosition = undefined;
  if (!mode.selected) {
    removeAllBaseHighlightings(mode.strictDrawing.drawing);
  }
}

export function handleMousedownOnBase(mode: PivotingMode, b: Base) {
  if (mode.hovered) {
    mode.selected = mode.hovered;
    mode.pivoted = false;
    mode.viewReference = mode.hoveredPosition;
    if (mode.delayingPivots && typeof mode.hoveredPosition == 'number') {
      let b = mode.strictDrawing.drawing.getBaseAtOverallPosition(mode.hoveredPosition);
      if (b) {
        let pt = { x: b.xCenter, y: b.yCenter };
        mode.onlyMoving = overallPositionsOfBases(
          mode.strictDrawing.drawing,
          closestBasesTo(mode.strictDrawing.drawing, pt, 18)
        );
      }
    }
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
      mode.onlyMoving = undefined;
      removeAllBaseHighlightings(mode.strictDrawing.drawing);
      updateEntireLayout(mode.strictDrawing, { viewReference: mode.viewReference });
      mode.viewReference = undefined;
    }
  }
}

export function reset(mode: PivotingMode) {
  mode.hovered = undefined;
  mode.hoveredPosition = undefined;
  mode.selected = undefined;
  mode.onlyMoving = undefined;
  mode.viewReference = undefined;
  removeAllBaseHighlightings(mode.strictDrawing.drawing);
  mode.fireChange();
}
