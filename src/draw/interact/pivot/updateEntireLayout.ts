import { StrictDrawingInterface as StrictDrawing } from 'Draw/StrictDrawingInterface';

interface Options {

  // Overall position of the base to use as a reference
  // to maintain the view of the drawing after updating
  // the layout. By default, the base at overall position 1
  // is used.
  viewReference?: number;
}

export function updateEntireLayout(strictDrawing: StrictDrawing, options?: Options) {
  let vfBase = strictDrawing.drawing.getBaseAtOverallPosition(options?.viewReference ?? 1);
  let vfPrevCenter = vfBase ? { x: vfBase.xCenter, y: vfBase.yCenter } : null;
  strictDrawing.updateLayout({ updatePadding: true });
  if (vfBase && vfPrevCenter) {
    let zoom = strictDrawing.drawing.zoom;
    strictDrawing.drawing.scrollLeft += zoom * (vfBase.xCenter - vfPrevCenter.x);
    strictDrawing.drawing.scrollTop += zoom * (vfBase.yCenter - vfPrevCenter.y);
  }
}
