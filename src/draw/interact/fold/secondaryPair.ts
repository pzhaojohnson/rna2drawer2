import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import {
  hoveredComplement,
  Complement,
} from './hoveredComplement';
import canSecondaryPair from './canSecondaryPair';

function _addSecondaryBonds(mode: FoldingMode, comp: Complement) {
  let drawing = mode.strictDrawing.drawing;
  for (let i = 0; i < mode.selectedLength; i++) {
    let p1 = (mode.minSelected as number) + i;
    let p2 = comp.position3 - i;
    let b1 = drawing.getBaseAtOverallPosition(p1);
    let b2 = drawing.getBaseAtOverallPosition(p2);
    if (b1 && b2) {
      drawing.addSecondaryBond(b1, b2);
    }
  }
}

function _removeStretches(mode: FoldingMode, comp: Complement) {
  let perBaseProps = mode.strictDrawing.perBaseLayoutProps();
  for (let i = 0; i < mode.selectedLength; i++) {
    let p1 = (mode.minSelected as number) + i;
    let p2 = comp.position3 - i;
    let props1 = perBaseProps[p1 - 1];
    if (props1) {
      props1.stretch3 = 0;
    }
    let props2 = perBaseProps[p2 - 1];
    if (props2) {
      props2.stretch3 = 0;
    }
  }
  mode.strictDrawing.setPerBaseLayoutProps(perBaseProps);
}

export function secondaryPair(mode: FoldingMode) {
  let comp = hoveredComplement(mode);
  if (!mode.selected || !comp) {
    return;
  }
  if (!canSecondaryPair(mode)) {
    return;
  }
  mode.fireShouldPushUndo();
  _addSecondaryBonds(mode, comp);
  _removeStretches(mode, comp);
  mode.strictDrawing.applyLayout();
  mode.reset();
}

export default secondaryPair;
