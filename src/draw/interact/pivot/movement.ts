import {
  PivotingModeInterface as PivotingMode,
  Stem,
} from './PivotingModeInterface';
import { angleBetween } from '../../angleBetween';
import { normalizeAngle } from 'Math/angles/normalize';

export interface Movement {
  x: number;
  y: number;
}

export function normalizedMagnitudeOfMovement(mode: PivotingMode, move: Movement): number {
  let m = ((move.x ** 2) + (move.y ** 2)) ** 0.5;
  let sd = mode.strictDrawing;
  m /= (sd.baseWidth + sd.baseHeight) / 2;
  m /= sd.drawing.zoom;
  m *= 0.5; // pivoting feels a bit too fast otherwise
  return Number.isFinite(m) ? m : 0;
}

export function angleOfMovement(move: Movement): number {
  return angleBetween(0, 0, move.x, move.y);
}

export function angleOfStem53(mode: PivotingMode, st: Stem): number | undefined {
  let drawing = mode.strictDrawing.drawing;
  let b5 = drawing.getBaseAtOverallPosition(st.position5);
  let b3 = drawing.getBaseAtOverallPosition(st.position3);
  if (b5 && b3) {
    return b5.angleBetweenCenters(b3);
  }
  return undefined;
}

export function angleOfSelected53(mode: PivotingMode): number | undefined {
  if (mode.selected) {
    return angleOfStem53(mode, mode.selected);
  }
  return undefined;
}

export function outwardAngleOfOuterStem(mode: PivotingMode, outerStem: Stem, stemInLoop: Stem): number | undefined {
  let a53 = angleOfStem53(mode, outerStem);
  if (typeof a53 == 'number') {
    let drawing = mode.strictDrawing.drawing;
    let ob5 = drawing.getBaseAtOverallPosition(outerStem.position5);
    let ib5 = drawing.getBaseAtOverallPosition(stemInLoop.position5);
    if (ob5 && ib5) {
      let a55 = ob5.angleBetweenCenters(ib5);
      a55 = normalizeAngle(a55, a53);
      return a55 - a53 < Math.PI ? a53 + (Math.PI / 2) : a53 - (Math.PI / 2);
    }
  }
  return undefined;
}

export function movementIsUpstream(mode: PivotingMode, move: Movement): boolean {
  let sa = angleOfSelected53(mode);
  if (typeof sa == 'number') {
    let ma = angleOfMovement(move);
    ma = normalizeAngle(ma, sa);
    return ma - sa > Math.PI / 2 && ma - sa < 3 * Math.PI / 2;
  }
  return false;
}

export function movementIsDownstream(mode: PivotingMode, move: Movement): boolean {
  let sa = angleOfSelected53(mode);
  if (typeof sa == 'number') {
    let ma = angleOfMovement(move);
    ma = normalizeAngle(ma, sa);
    return ma - sa < Math.PI / 2 || ma - sa > 3 * Math.PI / 2;
  }
  return false;
}

export function movementIsOutward(mode: PivotingMode, outerStem: Stem, move: Movement): boolean {
  if (mode.selected) {
    let oa = outwardAngleOfOuterStem(mode, outerStem, mode.selected);
    if (typeof oa == 'number') {
      let ma = angleOfMovement(move);
      ma = normalizeAngle(ma, oa);
      return ma - oa < Math.PI / 4 || ma - oa > 7 * Math.PI / 4;
    }
  }
  return false;
}

export function movementIsInward(mode: PivotingMode, outerStem: Stem, move: Movement): boolean {
  if (mode.selected) {
    let oa = outwardAngleOfOuterStem(mode, outerStem, mode.selected);
    if (typeof oa == 'number') {
      let ma = angleOfMovement(move);
      ma = normalizeAngle(ma, oa);
      return ma - oa > 3 * Math.PI / 4 && ma - oa < 5 * Math.PI / 4;
    }
  }
  return false;
}
