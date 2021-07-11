import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { findPathByUniqueId } from 'Draw/saved/svg';
import { getBaseByUniqueId } from 'Draw/saved/bases';
import { TertiaryBond } from './TertiaryBond';
import { values } from './values';

export type SavedState = { [key: string]: unknown }

export function addSavedTertiaryBond(drawing: Drawing, saved: SavedState): TertiaryBond | never {
  if (saved.className != 'QuadraticBezierBond') {
    throw new Error('Saved state is not for a quadratic bezier bond.');
  }
  let path = findPathByUniqueId(drawing.svg, saved.pathId);
  let base1 = getBaseByUniqueId(drawing, saved.baseId1);
  let base2 = getBaseByUniqueId(drawing, saved.baseId2);
  let tb = new TertiaryBond(path, base1, base2);
  drawing.tertiaryBonds.push(tb);
  TertiaryBond.recommendedDefaults = values(tb);
  return tb;
}
