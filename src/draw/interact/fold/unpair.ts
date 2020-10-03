import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import { selectedRange } from './selected';
import secondaryBondsWith from './secondaryBondsWith';
import { stemOfPosition } from '../../../parse/stemOfPosition';
import { PerBaseStrictLayoutProps as PerBaseProps } from '../../layout/singleseq/strict/PerBaseStrictLayoutProps';
import { copyStemProps, resetStemProps } from '../../layout/singleseq/strict/stemProps';
import adjustStretches from './adjustStretches';

function _transferStemProps(mode: FoldingMode) {
  let rSelected = selectedRange(mode);
  if (rSelected) {
    let partners = mode.strictDrawing.layoutPartners();
    let st = stemOfPosition(rSelected.end + 1, partners);
    if (st && st.position5 <= rSelected.end) {
      let perBaseProps = mode.strictDrawing.perBaseLayoutProps();
      let fromProps = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, st.position5);
      let toProps = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, rSelected.end + 1);
      copyStemProps(fromProps, toProps);
      let wasFlipped = fromProps.flipStem;
      resetStemProps(fromProps);
      if (wasFlipped && st.position5 < rSelected.start) {
        fromProps.flipStem = true;
        toProps.flipStem = false;
      }
      mode.strictDrawing.setPerBaseLayoutProps(perBaseProps);
    }
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
  mode.strictDrawing.applyLayout();
  mode.reset();
}

export default unpair;
