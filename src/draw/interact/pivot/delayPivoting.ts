import { PivotingModeInterface as PivotingMode } from './PivotingModeInterface';

export function delayPivoting(mode: PivotingMode) {
  mode.delayingPivots = true;
  mode.fireChange();
}

export function shouldDelayPivoting(mode: PivotingMode): boolean {
  return mode.strictDrawing.drawing.numBases > 850;
}

export function delayPivotingIfShould(mode: PivotingMode) {
  if (shouldDelayPivoting(mode)) {
    delayPivoting(mode);
  }
}
