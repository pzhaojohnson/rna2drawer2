import { StrictDrawingInterface as StrictDrawing } from 'Draw/strict/StrictDrawingInterface';
import { StrictLayout } from 'Draw/strict/layout/StrictLayout';
import layoutPartnersOfStrictDrawing from './layoutPartnersOfStrictDrawing';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { resize } from 'Draw/dimensions';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { orientBaseNumberings } from 'Draw/bases/number/orient';

export interface Options {

  // When specified, only bases at the given overall positions
  // in the drawing are moved. Otherwise, all bases are moved.
  onlyMove?: Set<number>;

  // Specifies whether to update the padding between the bases
  // and the edges of the drawing. When the padding is not
  // updated, often times fewer bases have to be moved, which
  // improves performance.
  updatePadding?: boolean;
}

export const defaultOptions: Options = {
  updatePadding: true,
}

function createLayout(strictDrawing: StrictDrawing): StrictLayout | undefined {
  try {
    return new StrictLayout(
      layoutPartnersOfStrictDrawing(strictDrawing),
      strictDrawing.generalLayoutProps,
      strictDrawing.perBaseLayoutProps(),
    );
  } catch (err) {
    console.error('Unable to create layout for drawing.');
    return undefined;
  }
}

function updateDimensions(strictDrawing: StrictDrawing, layout: StrictLayout) {
  let prevWidth = strictDrawing.drawing.width;
  let prevHeight = strictDrawing.drawing.height;
  let width = Math.max(
    (2 * window.screen.width) + (strictDrawing.baseWidth * layout.width),
    prevWidth,
  );
  let height = Math.max(
    (2 * window.screen.height) + (strictDrawing.baseHeight * layout.height),
    prevHeight,
  );
  resize(strictDrawing.drawing, { width, height });
}

function moveBases(strictDrawing: StrictDrawing, layout: StrictLayout, options?: Options) {
  let layoutMins = {
    x: layout.xMin,
    y: layout.yMin,
  }; // cache to improve performance
  let xOffset = 0;
  let yOffset = 0;
  if (options?.updatePadding) {
    xOffset = (strictDrawing.drawing.width - (strictDrawing.baseWidth * layout.width)) / 2;
    yOffset = (strictDrawing.drawing.height - (strictDrawing.baseHeight * layout.height)) / 2;
  } else {
    let b1 = strictDrawing.drawing.getBaseAtOverallPosition(1);
    let bcs1 = layout.baseCoordinatesAtPosition(1);
    if (b1 && bcs1) {
      xOffset = b1.xCenter - (strictDrawing.baseWidth * (bcs1.xCenter - layoutMins.x));
      yOffset = b1.yCenter - (strictDrawing.baseHeight * (bcs1.yCenter - layoutMins.y));
    }
  }
  strictDrawing.drawing.forEachBase((b, p) => {
    let shouldBeMoved = !options || !options.onlyMove || options.onlyMove.has(p);
    if (shouldBeMoved) {
      let bcs = layout.baseCoordinatesAtPosition(p);
      if (bcs) {
        b.recenter({
          x: xOffset + (strictDrawing.baseWidth * (bcs.xCenter - layoutMins.x)),
          y: yOffset + (strictDrawing.baseHeight * (bcs.yCenter - layoutMins.y)),
        });
      }
    }
  });
}

function repositionBonds(drawing: Drawing, options?: Options) {
  let basePositions = new Map<Base, number>();
  drawing.bases().forEach((b, i) => basePositions.set(b, i + 1));
  [
    ...drawing.primaryBonds,
    ...drawing.secondaryBonds,
    ...drawing.tertiaryBonds,
  ].forEach(bond => {
    if (!options?.onlyMove) {
      // reposition all bonds by default if all bases may have been moved
      bond.reposition();
    } else {
      let p1 = basePositions.get(bond.base1) ?? 0;
      let p2 = basePositions.get(bond.base2) ?? 0;
      if (options.onlyMove.has(p1) || options.onlyMove.has(p2)) {
        bond.reposition();
      }
    }
  });
}

export function updateLayout(strictDrawing: StrictDrawing, options=defaultOptions) {
  let layout = createLayout(strictDrawing);
  if (layout) {
    if (options.updatePadding) {
      updateDimensions(strictDrawing, layout);
    }
    moveBases(strictDrawing, layout, options);
    repositionBonds(strictDrawing.drawing, options);
    orientBaseNumberings(strictDrawing.drawing);
  }
}
