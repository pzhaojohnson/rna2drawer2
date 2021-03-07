import { StrictDrawingInterface as StrictDrawing } from 'Draw/StrictDrawingInterface';

export function updateEntireLayout(strictDrawing: StrictDrawing) {
  let b1 = strictDrawing.drawing.getBaseAtOverallPosition(1);
  let prevCenter1 = b1 ? { x: b1.xCenter, y: b1.yCenter } : null;
  strictDrawing.updateLayout({ updatePadding: true });
  if (b1 && prevCenter1) {
    let zoom = strictDrawing.drawing.zoom;
    strictDrawing.drawing.scrollLeft += zoom * (b1.xCenter - prevCenter1.x);
    strictDrawing.drawing.scrollTop += zoom * (b1.yCenter - prevCenter1.y);
  }
}
