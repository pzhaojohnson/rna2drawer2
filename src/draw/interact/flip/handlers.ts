import { FlippingModeInterface as FlippingMode } from './FlippingModeInterface';
import { BaseInterface as Base } from '../../BaseInterface';
import { stemOfPosition } from '../../../parse/stemOfPosition';
import { highlightStem } from './highlight';
import { removeAllBaseHighlightings } from '../highlight/removeAllBaseHighlightings';
import { PerBaseStrictLayoutProps as PerBaseProps } from '../../layout/singleseq/strict/PerBaseStrictLayoutProps';

export function handleMouseoverOnBase(mode: FlippingMode, b: Base) {
  let p = mode.strictDrawing.drawing.overallPositionOfBase(b);
  if (p > 0) {
    mode.hovered = p;
    let partners = mode.strictDrawing.layoutPartners();
    let st = stemOfPosition(p, partners);
    if (st) {
      highlightStem(mode, st);
    }
  }
}

export function handleMouseoutOnBase(mode: FlippingMode, b: Base) {
  mode.hovered = undefined;
  removeAllBaseHighlightings(mode.strictDrawing.drawing);
}

export function handleMousedownOnBase(mode: FlippingMode, b: Base) {
  if (typeof mode.hovered == 'number') {
    let partners = mode.strictDrawing.layoutPartners();
    let st = stemOfPosition(mode.hovered, partners);
    if (st) {
      mode.fireShouldPushUndo();
      let perBaseProps = mode.strictDrawing.perBaseLayoutProps();
      let props5 = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, st.position5);
      props5.flipStem = !props5.flipStem;
      mode.strictDrawing.setPerBaseLayoutProps(perBaseProps);
      mode.strictDrawing.applyLayout();
      mode.fireChange();
    }
  }
}

export function refresh(mode: FlippingMode) {
  reset(mode);
}

export function reset(mode: FlippingMode) {
  mode.hovered = undefined;
  removeAllBaseHighlightings(mode.strictDrawing.drawing);
  mode.fireChange();
}
