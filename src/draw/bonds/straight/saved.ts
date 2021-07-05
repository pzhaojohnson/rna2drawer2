import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { PrimaryBond } from './PrimaryBond';
import { SecondaryBond } from './SecondaryBond';
import { secondaryBondTypes } from './SecondaryBondInterface';
import { findLineByUniqueId } from 'Draw/saved/svg';
import { SVGLineWrapper as LineWrapper } from 'Draw/svg/line';
import { getBaseByUniqueId } from 'Draw/saved/bases';
import { values } from './values';

export type SavedState = { [key: string]: unknown }

function assertIsSavedStraightBond(state: SavedState): void | never {
  if (state.className != 'StraightBond') {
    throw new Error('Saved state is not for a straight bond.');
  }
}

export function addSavedPrimaryBonds(drawing: Drawing, saved: SavedState[]): void | never {
  saved.forEach(state => {
    assertIsSavedStraightBond(state);
    let pb = new PrimaryBond(
      new LineWrapper(findLineByUniqueId(drawing.svg, state.lineId)),
      getBaseByUniqueId(drawing, state.baseId1),
      getBaseByUniqueId(drawing, state.baseId2),
    );
    drawing.primaryBonds.push(pb);
    PrimaryBond.recommendedDefaults = values(pb);
  });
}

export function addSavedSecondaryBonds(drawing: Drawing, saved: SavedState[]): void | never {
  saved.forEach(state => {
    assertIsSavedStraightBond(state);
    let sb = new SecondaryBond(
      new LineWrapper(findLineByUniqueId(drawing.svg, state.lineId)),
      getBaseByUniqueId(drawing, state.baseId1),
      getBaseByUniqueId(drawing, state.baseId2),
    );
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
          // only line stroke may differ by secondary bond type
          'stroke': t == sbt ? sbvs.line.stroke : vs.line.stroke,
        },
      };
    });
  });
}