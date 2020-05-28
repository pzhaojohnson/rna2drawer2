import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';

export function handleMousedownOnDrawing(mode: FoldingMode) {
  if (!mode.hovered) {
    mode.reset();
  }
}

export default handleMousedownOnDrawing;
