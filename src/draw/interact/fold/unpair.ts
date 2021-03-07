import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import { selectedRange } from './selected';
import secondaryBondsWith from './secondaryBondsWith';
import { willUnpair } from '../../layout/singleseq/strict/stemProps';
import adjustStretches from './adjustStretches';

function _transferStemProps(mode: FoldingMode) {
  let rSelected = selectedRange(mode);
  if (rSelected) {
    let partners = mode.strictDrawing.layoutPartners();
    let perBaseProps = mode.strictDrawing.perBaseLayoutProps();
    willUnpair(partners, perBaseProps, rSelected);
    mode.strictDrawing.setPerBaseLayoutProps(perBaseProps);
  }
}

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
  _transferStemProps(mode);
  let drawing = mode.strictDrawing.drawing;
  ids.forEach(id => drawing.removeSecondaryBondById(id));
  adjustStretches(mode);
  mode.strictDrawing.updateLayout();
  mode.reset();
}

export default unpair;
