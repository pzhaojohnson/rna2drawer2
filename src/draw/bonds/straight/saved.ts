import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { PrimaryBondInterface } from './PrimaryBondInterface';
import { PrimaryBond } from './PrimaryBond';
import { SecondaryBondInterface, secondaryBondTypes } from './SecondaryBondInterface';
import { SecondaryBond } from './SecondaryBond';
import { findLineByUniqueId } from 'Draw/saved/svg';
import { SVGLineWrapper as LineWrapper } from 'Draw/svg/SVGLineWrapper';
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

function updateRecommendedDefaultsForPrimaryBonds(addedPrimaryBonds: PrimaryBondInterface[]) {
  let last = atIndex(addedPrimaryBonds, addedPrimaryBonds.length - 1);
  if (last) {
    PrimaryBond.recommendedDefaults = values(last);
  }
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
  updateRecommendedDefaultsForPrimaryBonds(pbs);
  return pbs;
}

function updateRecommendedDefaultsForSecondaryBonds(addedSecondaryBonds: SecondaryBondInterface[]) {
  addedSecondaryBonds.forEach(sb => {
    let stroke = sb.line.attr('stroke');
    if (typeof stroke == 'string') {
      SecondaryBond.recommendedDefaults[sb.type].line['stroke'] = stroke;
    }
    let strokeOpacity = sb.line.attr('stroke-opacity');
    if (typeof strokeOpacity == 'number') {
      SecondaryBond.recommendedDefaults[sb.type].line['stroke-opacity'] = strokeOpacity;
    }
  });

  let last = atIndex(addedSecondaryBonds, addedSecondaryBonds.length - 1);
  if (last) {
    let vs = values(last);
    secondaryBondTypes.forEach(t => {
      SecondaryBond.recommendedDefaults[t] = {
        ...vs,
        line: {
          ...vs.line,

          // stroke and stroke-opacity differ by secondary bond type
          'stroke': SecondaryBond.recommendedDefaults[t].line['stroke'],
          'stroke-opacity': SecondaryBond.recommendedDefaults[t].line['stroke-opacity'],
        }
      };
    });
  }
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
  });
  drawing.secondaryBonds.push(...sbs);
  updateRecommendedDefaultsForSecondaryBonds(sbs);
  return sbs;
}
