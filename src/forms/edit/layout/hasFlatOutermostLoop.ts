import type { StrictDrawing } from 'Draw/strict/StrictDrawing';

export function hasFlatOutermostLoop(strictDrawing: StrictDrawing): boolean {
  return strictDrawing.generalLayoutProps.outermostLoopShape == 'flat';
}
