import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { StrictLayoutSpecification } from './StrictLayoutSpecification';
import { centerOfOutermostLoop } from './centerOfOutermostLoop';
import { zoom } from 'Draw/zoom';

// updates the layout of the strict drawing using the given strict layout
// specification and tries to maintain the overall view of the drawing
// using the center of the outermost loop for reference
export function updateLayout(strictDrawing: StrictDrawing, spec: StrictLayoutSpecification) {
  let prevCenter = centerOfOutermostLoop(strictDrawing);

  // update the layout
  strictDrawing.generalLayoutProps = spec.generalProps;
  strictDrawing.setPerBaseLayoutProps(spec.perBasePropsArray);
  strictDrawing.updateLayout();

  // adjust the view of the drawing
  let currCenter = centerOfOutermostLoop(strictDrawing);
  let z = zoom(strictDrawing.drawing) ?? 1;
  let shift = {
    x: z * (currCenter.x - prevCenter.x),
    y: z * (currCenter.y - prevCenter.y),
  };
  // check for finiteness just to be safe
  if (Number.isFinite(shift.x) && Number.isFinite(shift.y)) {
    strictDrawing.drawing.scroll.left += shift.x;
    strictDrawing.drawing.scroll.top += shift.y;
  }
}
