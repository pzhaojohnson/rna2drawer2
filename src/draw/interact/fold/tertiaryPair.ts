import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import hoveredComplement from './hoveredComplement';

export function tertiaryPair(mode: FoldingMode) {
  let comp = hoveredComplement(mode);
  if (!mode.selected || !comp) {
    return;
  }
  mode.fireShouldPushUndo();
  let drawing = mode.strictDrawing.drawing;
  for (let i = 0; i < mode.selectedLength; i++) {
    let p1 = (mode.minSelected as number) + i;
    let p2 = comp.position3 - i;
    let b1 = drawing.getBaseAtOverallPosition(p1);
    let b2 = drawing.getBaseAtOverallPosition(p2);
    if (b1 && b2) {
      if (p1 < p2) {
        drawing.addTertiaryBond(b1, b2);
      } else {
        drawing.addTertiaryBond(b2, b1);
      }
    }
  }
  mode.reset();
}

export default tertiaryPair;
