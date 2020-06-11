import { DrawingInterface as Drawing } from '../DrawingInterface';
import StrictLayout from '../layout/singleseq/strict/StrictLayout';

function _moveBases(drawing: Drawing, layout: StrictLayout, baseWidth: number, baseHeight: number) {
  let xMin = layout.xMin;
  let yMin = layout.yMin;
  drawing.forEachBase((b, p) => {
    let bcs = layout.baseCoordinatesAtPosition(p);
    b.moveTo(
      window.screen.width + (baseWidth * (bcs.xCenter - xMin)),
      window.screen.height + (baseHeight * (bcs.yCenter - yMin)),
    );
  });
}

function _setWidthAndHeight(drawing: Drawing, layout: StrictLayout, baseWidth: number, baseHeight: number) {
  let xMin = layout.xMin;
  let xMax = layout.xMax;
  let yMin = layout.yMin;
  let yMax = layout.yMax;
  drawing.setWidthAndHeight(
    (2 * window.screen.width) + (baseWidth * (xMax - xMin)),
    (2 * window.screen.height) + (baseHeight * (yMax - yMin)),
  );
}

export function applyStrictLayout(drawing: Drawing, layout: StrictLayout, baseWidth: number, baseHeight: number) {
  _moveBases(drawing, layout, baseWidth, baseHeight);
  drawing.repositionBonds();
  drawing.adjustNumberingLineAngles();
  _setWidthAndHeight(drawing, layout, baseWidth, baseHeight);
}

export default applyStrictLayout;
