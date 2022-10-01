import type { Drawing } from 'Draw/Drawing';
import type { StrictDrawing } from 'Draw/strict/StrictDrawing';

import type { Bond } from 'Draw/bonds/Bond';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

import { shiftControlPoint as translateControlPoint } from 'Draw/bonds/curved/drag';

import { strungElementContainsNode } from 'Draw/bonds/strung/strungElementContainsNode';

import { handleDragOnStrungElement } from './handleDragOnStrungElement';

function isTertiaryBond(value: unknown): value is TertiaryBond {
  return value instanceof TertiaryBond;
}

type TertiaryBondPathsDragEvent = {
  /**
   * The triggering mouse move event.
   */
  mouseMove: MouseEvent;

  /**
   * The tertiary bonds whose paths are being dragged.
   */
  tertiaryBonds: TertiaryBond[];

  /**
   * The drawing that the tertiary bonds are in.
   */
  drawing: Drawing | StrictDrawing;
};

/**
 * Translates the control points of the tertiary bonds path elements.
 */
function handleDragOnTertiaryBondPaths(event: TertiaryBondPathsDragEvent) {
  let { mouseMove, tertiaryBonds, drawing } = event;

  // convert to drawing coordinates
  let translationEnd = drawing.svg.point(mouseMove.pageX, mouseMove.pageY);

  // convert to drawing coordinates
  let translationStart = drawing.svg.point(
    mouseMove.pageX - mouseMove.movementX,
    mouseMove.pageY - mouseMove.movementY,
  );

  tertiaryBonds.forEach(tb => {
    // multiply by 2 for translation speed to match dragging speed
    translateControlPoint(tb, {
      x: 2 * (translationEnd.x - translationStart.x),
      y: 2 * (translationEnd.y - translationStart.y),
    });
  });
}

export type BondsDragEvent = {
  /**
   * The triggering mouse move event.
   */
  mouseMove: MouseEvent;

  /**
   * The event target that is active during the drag event.
   *
   * (Such as the element that was clicked on when dragging was
   * initiated.)
   */
  activeEventTarget: EventTarget | null | undefined;

  /**
   * The bonds being dragged.
   */
  bonds: Bond[];

  /**
   * The drawing that the bonds are in.
   */
  drawing: Drawing | StrictDrawing;
};

/**
 * If a strung element of the bonds is being dragged, then the strung
 * element being dragged is translated.
 *
 * If the path element of a tertiary bond is being dragged, then the
 * control points of the tertiary bonds path elements are translated.
 *
 * Otherwise does nothing.
 */
export function handleDragOnBonds(event: BondsDragEvent) {
  let { mouseMove, activeEventTarget, bonds, drawing } = event;

  if (!(activeEventTarget instanceof Node)) {
    console.error('The active event target is not a node.');
    return;
  }

  let activeNode = activeEventTarget;

  let strungElements = bonds.flatMap(bond => bond.strungElements);

  let strungElement = strungElements.find(ele => (
    strungElementContainsNode(ele, activeNode)
  ));

  if (strungElement) { // a strung element is being dragged
    handleDragOnStrungElement({ strungElement, mouseMove, drawing });
    return;
  }

  let tertiaryBonds = bonds.filter(isTertiaryBond);

  if (tertiaryBonds.some(tb => tb.path.node.contains(activeNode))) {
    handleDragOnTertiaryBondPaths({ tertiaryBonds, mouseMove, drawing });
    return;
  }
}
