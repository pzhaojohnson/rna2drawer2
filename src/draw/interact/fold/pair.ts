import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import {
  hoveredComplement,
  Complement,
} from './hoveredComplement';
import selectedAreSecondaryUnpaired from './selectedAreSecondaryUnpaired';
import isKnotless from '../../../parse/isKnotless';

type Pair = [number, number];

function pairs(mode: FoldingMode, comp: Complement): Pair[] {
  let ps = [];
  for (let i = 0; i < mode.selectedLength; i++) {
    let p: Pair = [
      mode.minSelected + i,
      comp.position3 - i,
    ];
    ps.push(p);
  }
  return ps;
}

function canAddSecondaryBonds(mode: FoldingMode, comp: Complement): boolean {
  if (!selectedAreSecondaryUnpaired(mode)) {
    return false;
  }
  let partners = mode.strictDrawing.layoutPartners();
  pairs(mode, comp).forEach((p: Pair) => {
    partners[p[0] - 1] = p[1];
    partners[p[1] - 1] = p[0];
  });
  return isKnotless(partners);
}

function addSecondaryBonds(mode: FoldingMode, comp: Complement) {
  let drawing = mode.strictDrawing.drawing;
  pairs(mode, comp).forEach((p: Pair) => {
    let b1 = drawing.getBaseAtOverallPosition(p[0]);
    let b2 = drawing.getBaseAtOverallPosition(p[1]);
    drawing.addSecondaryBond(b1, b2);
  });
}

function removeStretchOfPairs(mode: FoldingMode, comp: Complement) {
  let perBaseProps = mode.strictDrawing.perBaseLayoutProps();
  pairs(mode, comp).forEach((p: Pair) => {
    perBaseProps[p[0] - 1].stretch3 = 0;
    perBaseProps[p[1] - 1].stretch3 = 0;
  });
}

function addTertiaryBonds(mode: FoldingMode, comp: Complement) {
  let drawing = mode.strictDrawing.drawing;
  pairs(mode, comp).forEach((p: Pair) => {
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
  if (canAddSecondaryBonds(mode, comp)) {
    addSecondaryBonds(mode, comp);
    removeStretchOfPairs(mode, comp);
    mode.strictDrawing.applyLayout();
  } else {
    addTertiaryBonds(mode, comp);
  }
  mode.reset();
}

export default pair;
