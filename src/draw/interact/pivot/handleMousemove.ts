import { PivotingModeInterface as PivotingMode } from './PivotingModeInterface';
import pivot from './pivot';

let xPrev = NaN;
let yPrev = NaN;
let xCurr = NaN;
let yCurr = NaN;

function storeMouseCoordinates(event: MouseEvent) {
  xPrev = xCurr;
  yPrev = yCurr;
  xCurr = event.screenX;
  yCurr = event.screenY;
  if (!Number.isFinite(xPrev)) {
    xPrev = event.screenX;
    yPrev = event.screenY;
  }
}

function xMove(): number {
  if (!Number.isFinite(xPrev) || !Number.isFinite(xCurr)) {
    return 0;
  }
  return xCurr - xPrev;
}

function yMove(): number {
  if (!Number.isFinite(yPrev) || !Number.isFinite(yCurr)) {
    return 0;
  }
  return yCurr - yPrev;
}

export function handleMousemove(mode: PivotingMode, event: MouseEvent) {
  storeMouseCoordinates(event);
  if (mode.disabled()) {
    return;
  }
  if (!mode.selectedPosition) {
    return;
  }
  pivot(mode, xMove(), yMove());
}

export default handleMousemove;
