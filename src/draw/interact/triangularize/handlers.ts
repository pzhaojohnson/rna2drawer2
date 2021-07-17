import { TriangularizingModeInterface as TriangularizingMode } from './TriangularizingModeInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import {
  outerStemOfHoveredLoop,
  hoveringHairpin,
  unstretchEndsOfLoop,
  defaultTriangleLoopHeight,
} from './structure';
import { highlightHovered } from './highlight';
import { removeAllBaseHighlightings } from '../highlight/removeAllBaseHighlightings';
import {
  PerBaseStrictLayoutProps as PerBaseProps,
} from '../../layout/singleseq/strict/PerBaseStrictLayoutProps';

export function handleMouseoverOnBase(mode: TriangularizingMode, b: Base) {
  let p = mode.strictDrawing.drawing.overallPositionOfBase(b);
  if (p > 0) {
    mode.hovered = p;
    if (!hoveringHairpin(mode)) {
      highlightHovered(mode);
    }
  }
}

export function handleMouseoutOnBase(mode: TriangularizingMode, b: Base) {
  mode.hovered = undefined;
  removeAllBaseHighlightings(mode.strictDrawing.drawing);
}

export function handleMousedownOnBase(mode: TriangularizingMode, b: Base) {
  if (typeof mode.hovered == 'number') {
    if (!hoveringHairpin(mode)) {
      mode.fireShouldPushUndo();
      let ost = outerStemOfHoveredLoop(mode);
      if (ost) {
        let partners = mode.strictDrawing.layoutPartners();
        let perBaseProps = mode.strictDrawing.perBaseLayoutProps();
        let props = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, ost.position5);
        props.loopShape = props.loopShape == 'triangle' ? 'round' : 'triangle';
        if (props.loopShape == 'triangle') {
          unstretchEndsOfLoop(partners, perBaseProps, ost);
          props.triangleLoopHeight = defaultTriangleLoopHeight(partners, ost);
        }
        mode.strictDrawing.setPerBaseLayoutProps(perBaseProps);
      } else { // hovering outermost loop
        let generalProps = mode.strictDrawing.generalLayoutProps();
        generalProps.outermostLoopShape = generalProps.outermostLoopShape == 'flat' ? 'round' : 'flat';
        mode.strictDrawing.setGeneralLayoutProps(generalProps);
      }
      mode.strictDrawing.updateLayout();
      mode.fireChange();
    }
  }
}

export function reset(mode: TriangularizingMode) {
  mode.hovered = undefined;
  removeAllBaseHighlightings(mode.strictDrawing.drawing);
  mode.fireChange();
}
