import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import { selectedRange } from './selected';
import secondaryBondsWith from './secondaryBondsWith';
import adjustStretches from './adjustStretches';

export function unpair(mode: FoldingMode) {
  let rSelected = selectedRange(mode);
  if (!rSelected) {
    return;
  }
  let bonds = secondaryBondsWith(mode, rSelected);
  let ids = [] as string[];
  bonds.forEach(sb => ids.push(sb.id));
  if (ids.length == 0) {
    return;
  }
  mode.fireShouldPushUndo();
  let drawing = mode.strictDrawing.drawing;
  ids.forEach(id => drawing.removeSecondaryBondById(id));
  adjustStretches(mode);
  mode.strictDrawing.applyLayout();
  mode.reset();
}

export default unpair;
