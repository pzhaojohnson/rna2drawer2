import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { BaseInterface as Base } from 'Draw/BaseInterface';
import { TertiaryBond } from './TertiaryBond';
import { setValues } from './values';

export function addTertiaryBond(drawing: Drawing, base1: Base, base2: Base): TertiaryBond {
  let path = drawing.svg.path('M 10 20 Q 30 40 50 60');
  let tb = new TertiaryBond(path, base1, base2);
  setValues(tb, TertiaryBond.recommendedDefaults);
  drawing.tertiaryBonds.push(tb);
  return tb;
}
