import { StrictDrawingInterface as StrictDrawing } from 'Draw/StrictDrawingInterface';

export function hasFlatOutermostLoop(strictDrawing: StrictDrawing): boolean {
  return strictDrawing.generalLayoutProps().outermostLoopShape == 'flat';
}
