import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { SVGPathWrapper as PathWrapper } from 'Draw/svg/path';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { TertiaryBond } from './TertiaryBond';
import { setValues } from './values';

export function addTertiaryBond(drawing: Drawing, base1: Base, base2: Base): TertiaryBond {
  let path = new PathWrapper(
    drawing.svg.path('M 10 20 Q 30 40 50 60')
  );
  let tb = new TertiaryBond(path, base1, base2);
  setValues(tb, TertiaryBond.recommendedDefaults);
  drawing.tertiaryBonds.push(tb);
  return tb;
}
