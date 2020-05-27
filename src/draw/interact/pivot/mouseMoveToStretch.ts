import { PivotingModeInterface as PivotingMode } from './PivotingModeInterface';

export function mouseMoveToStretch(mode: PivotingMode, xMove: number, yMove: number): number {
  let m = (xMove**2 + yMove**2)**0.5;
  let sd = mode.strictDrawing;
  let s = m / ((sd.baseWidth + sd.baseHeight) / 2);
  s /= sd.drawing.zoom;
  
  // pivoting feels a bit too fast otherwise
  s *= 0.6;
  
  if (Number.isFinite(s)) {
    return s;
  }
  return 0;
}

export default mouseMoveToStretch;
