import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { findPathByUniqueId } from 'Draw/saved/svg';
import { basesByUniqueId } from 'Draw/saved/bases';
import type { Base } from 'Draw/bases/Base';
import { TertiaryBond } from './TertiaryBond';
import { atIndex } from 'Array/at';
import { values } from './values';

export type SavedState = { [key: string]: unknown }

function assertIsSavedQuadraticBezierBond(saved: SavedState): void | never {
  if (saved.className != 'QuadraticBezierBond') {
    throw new Error('Saved state is not for a quadratic bezier bond.');
  }
}

function getBaseById(bases: Map<string, Base>, id: unknown): Base | never {
  if (typeof id != 'string') {
    throw new Error('Base ID is not a string.');
  }
  let b = bases.get(id);
  if (!b) {
    throw new Error(`No base has the ID: ${id}.`);
  }
  return b;
}

export function addSavedTertiaryBonds(drawing: Drawing, saveds: SavedState[]): TertiaryBond[] | never {
  let tbs: TertiaryBond[] = [];
  let bases = basesByUniqueId(drawing);
  saveds.forEach(saved => {
    assertIsSavedQuadraticBezierBond(saved);
    let path = findPathByUniqueId(drawing.svg, saved.pathId);
    let base1 = getBaseById(bases, saved.baseId1);
    let base2 = getBaseById(bases, saved.baseId2);
    tbs.push(new TertiaryBond(path, base1, base2));
  });
  drawing.tertiaryBonds.push(...tbs);

  // update recommended defaults
  let last = atIndex(tbs, tbs.length - 1);
  if (last) {
    TertiaryBond.recommendedDefaults = values(last);
  }

  return tbs;
}
