import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import { SecondaryBond } from '../../StraightBond';
import evenOutStretches from './evenOutStretches';
import selectedAreUnpaired from './selectedAreUnpaired';

export function unpair(mode: FoldingMode) {
  if (!mode.selected) {
    return;
  }
  if (selectedAreUnpaired(mode)) {
    return;
  }
  mode.fireShouldPushUndo();
  let toRemove: SecondaryBond[] = [];
  let drawing = mode.strictDrawing.drawing;
  drawing.forEachSecondaryBond((sb: SecondaryBond) => {
    let p1 = drawing.overallPositionOfBase(sb.base1);
    let p2 = drawing.overallPositionOfBase(sb.base2);
    if (mode.withinSelected(p1) || mode.withinSelected(p2)) {
      toRemove.push(sb);
    }
  });
  toRemove.forEach(sb => {
    drawing.removeSecondaryBondById(sb.id);
  });
  evenOutStretches(mode);
  mode.strictDrawing.applyLayout();
  mode.reset();
}

export default unpair;
