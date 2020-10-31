import { DrawingInterface as Drawing } from '../DrawingInterface';
import StrictLayout from '../layout/singleseq/strict/StrictLayout';

function adjustDimensions(drawing: Drawing, layout: StrictLayout, baseWidth: number, baseHeight: number) {
  let width = Math.max(
    (2 * window.screen.width) + (baseWidth * layout.width),
    drawing.width,
  );
  let height = Math.max(
    (2 * window.screen.height) + (baseHeight * layout.height),
    drawing.height,
  );
  drawing.setWidthAndHeight(width, height);
}

function moveBases(drawing: Drawing, layout: StrictLayout, baseWidth: number, baseHeight: number) {
  let xOffset = (drawing.width - (baseWidth * layout.width)) / 2;
  let yOffset = (drawing.height - (baseHeight * layout.height)) / 2;
  let xMin = layout.xMin;
  let yMin = layout.yMin;
  drawing.forEachBase((b, p) => {
    let bcs = layout.baseCoordinatesAtPosition(p);
    if (bcs) {
      b.moveTo(
        xOffset + (baseWidth * (bcs.xCenter - xMin)),
        yOffset + (baseHeight * (bcs.yCenter - yMin)),
      );
    }
  });
}

export function applyStrictLayout(drawing: Drawing, layout: StrictLayout, baseWidth: number, baseHeight: number) {
  adjustDimensions(drawing, layout, baseWidth, baseHeight);
  moveBases(drawing, layout, baseWidth, baseHeight);
  drawing.repositionBonds();
  drawing.adjustNumberingLineAngles();
}

export default applyStrictLayout;
