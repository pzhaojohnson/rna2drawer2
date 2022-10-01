import type { Drawing } from 'Draw/Drawing';
import { StrictDrawing } from 'Draw/strict/StrictDrawing';

import type { StrungElement } from 'Draw/bonds/strung/StrungElement';

import { translateStrungElement } from 'Draw/bonds/strung/translateStrungElement';

class DrawingWrapper {
  readonly drawing: Drawing | StrictDrawing;

  constructor(drawing: Drawing | StrictDrawing) {
    this.drawing = drawing;
  }

  get svg() {
    return this.drawing.svg;
  }

  get bonds() {
    return [
      ...this.drawing.primaryBonds,
      ...this.drawing.secondaryBonds,
      ...this.drawing.tertiaryBonds,
    ];
  }
}

export type StrungElementDragEvent = {
  /**
   * The triggering mouse move event.
   */
  mouseMove: MouseEvent;

  /**
   * The strung element that is being dragged.
   */
  strungElement: StrungElement;

  /**
   * The drawing that the strung element is in.
   */
  drawing: Drawing | StrictDrawing;
};

/**
 * Translates the strung element being dragged.
 *
 * Does not push undo or refresh the app.
 *
 * (This handler expects that pushing undo and refreshing the app are
 * performed on drag start and drag end, respectively.)
 */
export function handleDragOnStrungElement(event: StrungElementDragEvent) {
  let { mouseMove, strungElement } = event;

  let drawing = new DrawingWrapper(event.drawing);
  let bonds = drawing.bonds;

  // the bond containing the strung element
  let parentBond = bonds.find(bond => bond.contains(strungElement));

  if (!parentBond) {
    console.error('Unable to find the parent bond of the strung element.');
    return;
  }

  // convert to drawing coordinates
  let translationEnd = drawing.svg.point(mouseMove.pageX, mouseMove.pageY);

  // convert to drawing coordinates
  let translationStart = drawing.svg.point(
    mouseMove.pageX - mouseMove.movementX,
    mouseMove.pageY - mouseMove.movementY,
  );

  translateStrungElement({
    strungElement,
    parentBond,
    x: translationEnd.x - translationStart.x,
    y: translationEnd.y - translationStart.y,
  });
}
