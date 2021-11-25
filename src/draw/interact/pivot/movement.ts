import {
  PivotingModeInterface as PivotingMode,
  Stem,
} from './PivotingModeInterface';
import { zoom } from 'Draw/zoom';
import { direction2D as direction } from 'Math/points/direction';
import { normalizeAngle } from 'Math/angles/normalize';
import { isPoint2D as isPoint } from 'Math/points/Point';

export interface Movement {
  x: number;
  y: number;
}

export function normalizedMagnitudeOfMovement(mode: PivotingMode, move: Movement): number {
  let m = ((move.x ** 2) + (move.y ** 2)) ** 0.5;
  let sd = mode.strictDrawing;
  m /= (sd.baseWidth + sd.baseHeight) / 2;
  m /= zoom(sd.drawing) ?? 1;
  m *= 0.5; // pivoting feels a bit too fast otherwise
  return Number.isFinite(m) ? m : 0;
}

export function angleOfMovement(move: Movement): number {
  return direction({ x: move.x, y: move.y });
}

export function angleOfStem53(mode: PivotingMode, st: Stem): number | undefined {
  let drawing = mode.strictDrawing.drawing;
  let c5 = drawing.getBaseAtOverallPosition(st.position5)?.center();
  let c3 = drawing.getBaseAtOverallPosition(st.position3)?.center();
  if (c5 && isPoint(c5) && c3 && isPoint(c3)) {
    return Math.atan2(c3.y - c5.y, c3.x - c5.x);
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
    let oc5 = drawing.getBaseAtOverallPosition(outerStem.position5)?.center();
    let ic5 = drawing.getBaseAtOverallPosition(stemInLoop.position5)?.center();
    if (oc5 && isPoint(oc5) && ic5 && isPoint(ic5)) {
      let a55 = Math.atan2(ic5.y - oc5.y, ic5.x - oc5.x);
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
