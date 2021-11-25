import { StrictDrawingInterface as StrictDrawing } from 'Draw/strict/StrictDrawingInterface';

export function hasFlatOutermostLoop(strictDrawing: StrictDrawing): boolean {
  return strictDrawing.generalLayoutProps().outermostLoopShape == 'flat';
}
