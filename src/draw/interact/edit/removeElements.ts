import type { StrictDrawing } from 'Draw/strict/StrictDrawing';

import { DrawingElementInterface as DrawingElement } from './DrawingElementInterface';

import { Base } from 'Draw/bases/Base';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

import { removeBases } from 'Draw/strict/removeBases';
import { removePrimaryBonds } from 'Draw/strict/removePrimaryBonds';
import { removeSecondaryBonds } from 'Draw/strict/removeSecondaryBonds';
import { removeTertiaryBonds } from 'Draw/strict/removeTertiaryBonds';

import { removeNumbering } from 'Draw/bases/number/add';

function isBase(v: unknown): v is Base {
  return v instanceof Base;
}

function isBaseNumbering(v: unknown): v is BaseNumbering {
  return v instanceof BaseNumbering;
}

function isPrimaryBond(v: unknown): v is PrimaryBond {
  return v instanceof PrimaryBond;
}

function isSecondaryBond(v: unknown): v is SecondaryBond {
  return v instanceof SecondaryBond;
}

function isTertiaryBond(v: unknown): v is TertiaryBond {
  return v instanceof TertiaryBond;
}

function removeBaseNumberings(strictDrawing: StrictDrawing, baseNumberings: BaseNumbering[]) {
  let baseNumberingsSet = new Set(baseNumberings);
  strictDrawing.bases().forEach(base => {
    if (base.numbering && baseNumberingsSet.has(base.numbering)) {
      removeNumbering(base);
    }
  });
}

/**
 * Removes the specified elements from the strict drawing.
 */
export function removeElements(strictDrawing: StrictDrawing, eles: DrawingElement[]) {
  // functions to remove specific types of elements should only be called
  // if the specific type of element is present in the array of elements to remove,
  // since these functions may have side effects in addition to just removing elements
  // (such as updating base numberings)

  let baseNumberings = eles.filter(isBaseNumbering);
  if (baseNumberings.length > 0) {
    removeBaseNumberings(strictDrawing, baseNumberings);
  }

  let bases = eles.filter(isBase);
  if (bases.length > 0) {
    // call after removing any base numberings since this may update base numberings
    // (and cause BaseNumbering instances in the drawing to be replaced)
    removeBases(strictDrawing, bases);
  }

  let primaryBonds = eles.filter(isPrimaryBond);
  if (primaryBonds.length > 0) {
    removePrimaryBonds(strictDrawing, primaryBonds);
  }

  let secondaryBonds = eles.filter(isSecondaryBond);
  if (secondaryBonds.length > 0) {
    removeSecondaryBonds(strictDrawing, secondaryBonds);
  }

  let tertiaryBonds = eles.filter(isTertiaryBond);
  if (tertiaryBonds.length > 0) {
    removeTertiaryBonds(strictDrawing, tertiaryBonds);
  }
}
