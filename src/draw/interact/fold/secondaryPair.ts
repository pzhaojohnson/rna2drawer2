import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import selectedAreSecondaryUnpaired from './selectedAreSecondaryUnpaired';
import hoveredComplement from './hoveredComplement';
import isKnotless from '../../../parse/isKnotless';

export function canSecondaryPair(mode: FoldingMode): boolean {
  if (!mode.selected) {
    return false;
  }
  if (!selectedAreSecondaryUnpaired(mode)) {
    return false;
  }
  let comp = hoveredComplement(mode);
  if (!comp) {
    return false;
  }
  let partners = mode.strictDrawing.layoutPartners();
  for (let i = 0; i < mode.selectedLength; i++) {
    partners[mode.minSelected + i - 1] = comp.position3;
    partners[comp.position3 - i - 1] = mode.minSelected + i;
  }
  return isKnotless(partners);
}

export function secondaryPair(mode: FoldingMode) {
  if (!canSecondaryPair(mode)) {
    return;
  }
  mode.fireShouldPushUndo();
  let comp = hoveredComplement(mode);
  let drawing = mode.strictDrawing.drawing;
  let perBaseProps = mode.strictDrawing.perBaseLayoutProps();
  for (let i = 0; i < mode.selectedLength; i++) {
    let p1 = mode.minSelected + i;
    let p2 = comp.position3 - i;
    let b1 = drawing.getBaseAtOverallPosition(p1);
    let b2 = drawing.getBaseAtOverallPosition(p2);
    if (b1 && b2) {
      drawing.addSecondaryBond(b1, b2);
      let props1 = perBaseProps[p1 - 1];
      if (props1) {
        props1.stretch3 = 0;
      }
      let props2 = perBaseProps[p2 - 1];
      if (props2) {
        props2.stretch3 = 0;
      }
    }
  }
  mode.strictDrawing.setPerBaseLayoutProps(perBaseProps);
  mode.strictDrawing.applyLayout();
  mode.reset();
}

export default secondaryPair;
