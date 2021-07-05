import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { PrimaryBond } from './PrimaryBond';
import { SecondaryBond } from './SecondaryBond';
import { secondaryBondTypes } from './SecondaryBondInterface';
import { findLineByUniqueId } from 'Draw/saved/svg';
import { SVGLineWrapper as LineWrapper } from 'Draw/svg/line';
import { getBaseByUniqueId } from 'Draw/saved/bases';
import { values } from './values';

export type SavedState = { [key: string]: unknown }

function assertIsSavedStraightBond(saved: SavedState): void | never {
  if (saved.className != 'StraightBond') {
    throw new Error('Saved state is not for a straight bond.');
  }
}

export function addSavedPrimaryBond(drawing: Drawing, saved: SavedState): PrimaryBond | never {
  assertIsSavedStraightBond(saved);
  let line = new LineWrapper(
    findLineByUniqueId(drawing.svg, saved.lineId)
  );
  let base1 = getBaseByUniqueId(drawing, saved.baseId1);
  let base2 = getBaseByUniqueId(drawing, saved.baseId2);
  let pb = new PrimaryBond(line, base1, base2);
  drawing.primaryBonds.push(pb);
  PrimaryBond.recommendedDefaults = values(pb);
  return pb;
}

export function addSavedSecondaryBond(drawing: Drawing, saved: SavedState): SecondaryBond | never {
  assertIsSavedStraightBond(saved);
  let line = new LineWrapper(
    findLineByUniqueId(drawing.svg, saved.lineId)
  );
  let base1 = getBaseByUniqueId(drawing, saved.baseId1);
  let base2 = getBaseByUniqueId(drawing, saved.baseId2);
  let sb = new SecondaryBond(line, base1, base2);
  drawing.secondaryBonds.push(sb);

  // set recommended defaults for secondary bonds
  let sbt = sb.type;
  let sbvs = values(sb);
  secondaryBondTypes.forEach(t => {
    let vs = SecondaryBond.recommendedDefaults[t];
    SecondaryBond.recommendedDefaults[t] = {
      ...sbvs,
      line: {
        ...sbvs.line,
        // only line stroke differs by secondary bond type
        'stroke': t == sbt ? sbvs.line.stroke : vs.line.stroke,
      },
    };
  });

  return sb;
}
