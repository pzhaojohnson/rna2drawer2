import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { PrimaryBond } from './PrimaryBond';
import { SecondaryBond } from './SecondaryBond';
import { secondaryBondTypes } from './SecondaryBondInterface';
import { findLineByUniqueId } from 'Draw/saved/svg';
import { SVGLineWrapper as LineWrapper } from 'Draw/svg/line';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { basesByUniqueId } from 'Draw/saved/bases';
import { atIndex } from 'Array/at';
import { values } from './values';

export type SavedState = { [key: string]: unknown }

function assertIsSavedStraightBond(saved: SavedState): void | never {
  if (saved.className != 'StraightBond') {
    throw new Error('Saved state is not for a straight bond.');
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

export function addSavedPrimaryBonds(drawing: Drawing, saveds: SavedState[]): PrimaryBond[] | never {
  let pbs: PrimaryBond[] = [];
  let bases = basesByUniqueId(drawing);
  saveds.forEach(saved => {
    assertIsSavedStraightBond(saved);
    let line = new LineWrapper(
      findLineByUniqueId(drawing.svg, saved.lineId)
    );
    let base1 = getBaseById(bases, saved.baseId1);
    let base2 = getBaseById(bases, saved.baseId2);
    pbs.push(new PrimaryBond(line, base1, base2));
  });
  drawing.primaryBonds.push(...pbs);
  
  // update recommended defaults
  let last = atIndex(pbs, pbs.length - 1);
  if (last) {
    PrimaryBond.recommendedDefaults = values(last);
  }
  
  return pbs;
}

export function addSavedSecondaryBonds(drawing: Drawing, saveds: SavedState[]): SecondaryBond[] | never {
  let sbs: SecondaryBond[] = [];
  let bases = basesByUniqueId(drawing);
  saveds.forEach(saved => {
    assertIsSavedStraightBond(saved);
    let line = new LineWrapper(
      findLineByUniqueId(drawing.svg, saved.lineId)
    );
    let base1 = getBaseById(bases, saved.baseId1);
    let base2 = getBaseById(bases, saved.baseId2);
    let sb = new SecondaryBond(line, base1, base2);
    sbs.push(sb);

    // update recommended default for line stroke
    let stroke = sb.line.attr('stroke');
    if (typeof stroke == 'string') {
      SecondaryBond.recommendedDefaults[sb.type].line['stroke'] = stroke;
    }
  });
  drawing.secondaryBonds.push(...sbs);
  
  // update remaining recommended defaults
  let last = atIndex(sbs, sbs.length - 1);
  if (last) {
    let vs = values(last);
    secondaryBondTypes.forEach(t => {
      SecondaryBond.recommendedDefaults[t] = {
        ...vs,
        line: {
          ...vs.line,
          // only line stroke differs by secondary bond type
          'stroke': SecondaryBond.recommendedDefaults[t].line['stroke'],
        }
      };
    });
  }
  
  return sbs;
}
