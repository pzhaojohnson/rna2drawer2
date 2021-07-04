import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { BaseInterface as Base } from 'Draw/BaseInterface';
import { PrimaryBond } from './PrimaryBond';
import { SecondaryBond } from './SecondaryBond';
import { setValues } from './values';

// adds a primary bond between bases 1 and 2
export function addPrimaryBond(drawing: Drawing, base1: Base, base2: Base): PrimaryBond {
  let line = drawing.svg.line(10, 20, 30, 40);
  let pb = new PrimaryBond(line, base1, base2);
  setValues(pb, PrimaryBond.recommendedDefaults);
  pb.reposition();
  drawing.primaryBonds.push(pb);
  return pb;
}

// adds a secondary bond between bases 1 and 2
export function addSecondaryBond(drawing: Drawing, base1: Base, base2: Base): SecondaryBond {
  let line = drawing.svg.line(10, 20, 30, 40);
  let sb = new SecondaryBond(line, base1, base2);
  setValues(sb, SecondaryBond.recommendedDefaults[sb.type]);
  sb.reposition();
  drawing.secondaryBonds.push(sb);
  return sb;
}
