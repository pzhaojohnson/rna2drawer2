import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { BaseInterface as Base } from 'Draw/BaseInterface';
import { StraightBondInterface as StraightBond } from './StraightBondInterface';
import { PrimaryBond } from './PrimaryBond';
import { SecondaryBond } from './SecondaryBond';
import { setValues } from './values';
import { atIndex } from 'Array/at';

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

function remove(sb: StraightBond) {
  sb.line.remove();
}

export function removePrimaryBondById(drawing: Drawing, id: string) {
  let i = drawing.primaryBonds.findIndex(pb => pb.id == id);
  if (i < 0) {
    console.error('No primary bond has the given ID: ' + id + '.');
  } else {
    let pb = atIndex(drawing.primaryBonds, i);
    if (pb) {
      remove(pb);
      drawing.primaryBonds.splice(i, 1);
    }
  }
}

export function removeSecondaryBondById(drawing: Drawing, id: string) {
  let i = drawing.secondaryBonds.findIndex(sb => sb.id == id);
  if (i < 0) {
    console.error('No secondary bond has the given ID: ' + id + '.');
  } else {
    let sb = atIndex(drawing.secondaryBonds, i);
    if (sb) {
      remove(sb);
      drawing.secondaryBonds.splice(i, 1);
    }
  }
}
