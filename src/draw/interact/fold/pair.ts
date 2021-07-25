import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import canSecondaryPair from './canSecondaryPair';
import IntegerRange from './IntegerRange';
import { Base } from 'Draw/bases/Base';
import { selectedRange } from './selected';
import hoveredPairable from './hoveredPairable';
import { willPair } from '../../layout/singleseq/strict/stemProps';
import { addSecondaryBond } from 'Draw/bonds/straight/add';
import { addTertiaryBond } from 'Draw/bonds/curved/add';
import adjustStretches from './adjustStretches';

function _basePairs(mode: FoldingMode, r1: IntegerRange, r2: IntegerRange): [Base, Base][] {
  let pairs = [] as [Base, Base][];
  let drawing = mode.strictDrawing.drawing;
  for (let i = 0; i < Math.min(r1.size, r2.size); i++) {
    let p1 = r1.start + i;
    let p2 = r2.end - i;
    let b5 = drawing.getBaseAtOverallPosition(Math.min(p1, p2));
    let b3 = drawing.getBaseAtOverallPosition(Math.max(p1, p2));
    if (b5 && b3) {
      pairs.push([b5, b3]);
    }
  }
  return pairs;
}

function _transferStemProps(mode: FoldingMode) {
  let rSelected = selectedRange(mode);
  let pairable = hoveredPairable(mode);
  if (rSelected && pairable) {
    let partners = mode.strictDrawing.layoutPartners();
    let perBaseProps = mode.strictDrawing.perBaseLayoutProps();
    willPair(partners, perBaseProps, rSelected, pairable);
    mode.strictDrawing.setPerBaseLayoutProps(perBaseProps);
  }
}

function _secondaryPair(mode: FoldingMode, pairs: [Base, Base][]) {
  _transferStemProps(mode);
  let drawing = mode.strictDrawing.drawing;
  pairs.forEach(p => {
    addSecondaryBond(drawing, p[0], p[1]);
  });
}

function _tertiaryPair(mode: FoldingMode, pairs: [Base, Base][]) {
  let drawing = mode.strictDrawing.drawing;
  pairs.forEach(p => {
    addTertiaryBond(drawing, p[0], p[1]);
  });
}

export function pair(mode: FoldingMode) {
  let rSelected = selectedRange(mode);
  let pairable = hoveredPairable(mode);
  if (!rSelected || !pairable) {
    return;
  }
  mode.fireShouldPushUndo();
  let pairs = _basePairs(mode, rSelected, pairable);
  if (canSecondaryPair(mode) && !mode.onlyAddingTertiaryBonds()) {
    _secondaryPair(mode, pairs);
  } else {
    _tertiaryPair(mode, pairs);
  }
  adjustStretches(mode);
  mode.strictDrawing.updateLayout();
  mode.reset();
}

export default pair;
