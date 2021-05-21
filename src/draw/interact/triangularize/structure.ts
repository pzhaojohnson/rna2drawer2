import { TriangularizingModeInterface as TriangularizingMode } from './TriangularizingModeInterface';
import { containingStem } from 'Partners/containing';
import { containingUnpairedRegion } from 'Partners/containing';
import { closestStemOuterTo } from '../../../parse/closest';
import splitSecondaryAndTertiaryPairs from '../../../parse/splitSecondaryAndTertiaryPairs';
import {
  PerBaseStrictLayoutProps as PerBaseProps,
} from '../../layout/singleseq/strict/PerBaseStrictLayoutProps';
import { positionsWithStretch3 } from '../../layout/singleseq/strict/stretch';

export type PartnersNotation = (number | null)[];

export type PerBasePropsArray = (PerBaseProps | undefined)[];

export interface Stem {
  position5: number;
  position3: number;
  size: number;
}

export function outerStemOfHoveredLoop(mode: TriangularizingMode): Stem | undefined {
  if (typeof mode.hovered == 'number') {
    let partners = mode.strictDrawing.layoutPartners();
    let st = containingStem(partners, mode.hovered);
    if (st) {
      return st;
    } else {
      let ost = closestStemOuterTo(partners, mode.hovered);
      return ost ? ost : undefined;
    }
  }
}

export function positionsOfLoop(partners: PartnersNotation, st: Stem): number[] {
  let ps = [] as number[];
  partners = splitSecondaryAndTertiaryPairs(partners).secondaryPartners;
  let p = st.position5 + st.size;
  while (p < st.position3 - st.size + 1) {
    ps.push(p);
    let q = partners[p - 1];
    if (typeof q == 'number' && q > p) {
      p = q;
    } else {
      p++;
    }
  }
  return ps;
}

export function positionsOfOutermostLoop(partners: PartnersNotation): number[] {
  return positionsOfLoop(partners, {
    position5: 0,
    position3: partners.length + 1,
    size: 1,
  });
}

export function hasHairpinLoop(partners: PartnersNotation, st: Stem): boolean {
  let ur = containingUnpairedRegion(partners, st.position5 + st.size);
  if (ur) {
    return ur.boundingPosition3 == st.position3 - st.size + 1;
  }
  return false;
}

export function hoveringHairpin(mode: TriangularizingMode): boolean {
  let ost = outerStemOfHoveredLoop(mode);
  if (ost) {
    return hasHairpinLoop(mode.strictDrawing.layoutPartners(), ost);
  }
  return false;
}

export function unstretchEndsOfLoop(partners: PartnersNotation, perBaseProps: PerBasePropsArray, st: Stem) {
  let ps = [] as number[];
  let ur5 = containingUnpairedRegion(partners, st.position5 + st.size);
  if (ur5) {
    ps = ps.concat(positionsWithStretch3(ur5));
  }
  let ur3 = containingUnpairedRegion(partners, st.position3 - st.size);
  if (ur3) {
    ps = ps.concat(positionsWithStretch3(ur3));
  }
  ps.forEach(p => {
    let props = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, p);
    props.stretch3 = 0;
  });
}

export function defaultTriangleLoopHeight(partners: PartnersNotation, st: Stem): number {
  let loopSize = positionsOfLoop(partners, st).length;
  return Math.max(
    Math.floor(loopSize / 2),
    2,
  );
}
