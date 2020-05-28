import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import {
  hoveredComplement,
  Complement,
} from './hoveredComplement';
import selectedAreUnpaired from './selectedAreUnpaired';
import isKnotless from '../../../parse/isKnotless';

type Pair = [number, number];

function pairsOfComplement(mode: FoldingMode, comp: Complement): Pair[] {
  let pairs = [];
  for (let i = 0; i < mode.selectedLength; i++) {
    let p: Pair = [
      mode.minSelected + i,
      comp.position3 - i,
    ];
    pairs.push(p);
  }
  return pairs;
}

function addSecondaryBonds(mode: FoldingMode, comp: Complement) {
  let drawing = mode.strictDrawing.drawing;
  pairsOfComplement(mode, comp).forEach((p: Pair) => {
    let b1 = drawing.getBaseAtOverallPosition(p[0]);
    let b2 = drawing.getBaseAtOverallPosition(p[1]);
    drawing.addSecondaryBond(b1, b2);
  });
}

function removeStretch(mode: FoldingMode, comp: Complement) {
  let perBaseProps = mode.strictDrawing.perBaseLayoutProps();
  pairsOfComplement(mode, comp).forEach((p: Pair) => {
    perBaseProps[p[0] - 1].stretch3 = 0;
    perBaseProps[p[1] - 1].stretch3 = 0;
  });
}

function addTertiaryBonds(mode: FoldingMode, comp: Complement) {
  let drawing = mode.strictDrawing.drawing;
  pairsOfComplement(mode, comp).forEach((p: Pair) => {
    let b1 = drawing.getBaseAtOverallPosition(p[0]);
    let b2 = drawing.getBaseAtOverallPosition(p[1]);
    drawing.addTertiaryBond(b1, b2);
  });
}

export function pair(mode: FoldingMode) {
  let comp = hoveredComplement(mode);
  if (!mode.selected || !comp) {
    return;
  }
  mode.fireShouldPushUndo();
  if (!selectedAreUnpaired(mode)) {
    addTertiaryBonds(mode, comp);
    mode.reset();
    return;
  }
  let partners = mode.strictDrawing.layoutPartners();
  pairsOfComplement(mode, comp).forEach((p: Pair) => {
    partners[p[0] - 1] = p[1];
    partners[p[1] - 1] = p[0];
  });
  if (!isKnotless(partners)) {
    addTertiaryBonds(mode, comp);
    mode.reset();
    return;
  }
  addSecondaryBonds(mode, comp);
  removeStretch(mode, comp);
  mode.strictDrawing.applyLayout();
  mode.reset();
}

export default pair;
