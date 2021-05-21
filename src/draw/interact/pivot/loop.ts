import { Stem, UnpairedRegion } from './PivotingModeInterface';
import {
  PerBaseStrictLayoutProps as PerBaseProps,
} from '../../layout/singleseq/strict/PerBaseStrictLayoutProps';
import { containingUnpairedRegion } from 'Partners/containing';
import { closestStemOuterTo } from '../../../parse/closest';
import { containingStem } from 'Partners/containing';

export type PartnersNotation = (number | null)[];

export type PerBasePropsArray = (PerBaseProps | undefined)[];

export function unpairedRegionBefore(partners: PartnersNotation, st: Stem): UnpairedRegion {
  let p = st.position5 - 1;
  if (p < 1) {
    return { boundingPosition5: 0, boundingPosition3: 1 };
  } else {
    let ur = containingUnpairedRegion(partners, st.position5 - 1);
    if (ur) {
      return ur;
    } else {
      return { boundingPosition5: st.position5 - 1, boundingPosition3: st.position5 };
    }
  }
}

export function unpairedRegionAfter(partners: PartnersNotation, st: Stem): UnpairedRegion {
  let p = st.position3 + 1;
  if (p > partners.length) {
    return { boundingPosition5: partners.length, boundingPosition3: partners.length + 1 };
  } else {
    let ur = containingUnpairedRegion(partners, st.position3 + 1);
    if (ur) {
      return ur;
    } else {
      return { boundingPosition5: st.position3, boundingPosition3: st.position3 + 1 };
    }
  }
}

export function hasTriangleLoop(perBaseProps: PerBasePropsArray, st: Stem): boolean {
  let props = perBaseProps[st.position5 - 1];
  if (props) {
    return props.loopShape == 'triangle';
  }
  return false;
}

export function isInTriangleLoop(partners: PartnersNotation, perBaseProps: PerBasePropsArray, st: Stem): boolean {
  let outerStem = closestStemOuterTo(partners, st.position5);
  if (outerStem) {
    return hasTriangleLoop(perBaseProps, outerStem);
  }
  return false;
}

export function isFirstUnpairedRegionInLoop(partners: PartnersNotation, ur: UnpairedRegion): boolean {
  let st = containingStem(partners, ur.boundingPosition5);
  if (st) {
    return ur.boundingPosition5 == st.position5 + st.size - 1;
  } else {
    return ur.boundingPosition5 == 0;
  }
}

export function isLastUnpairedRegionInLoop(partners: PartnersNotation, ur: UnpairedRegion): boolean {
  let st = containingStem(partners, ur.boundingPosition3);
  if (st) {
    return ur.boundingPosition3 == st.position3 - st.size + 1;
  } else {
    return ur.boundingPosition3 == partners.length + 1;
  }
}

export function isFirstUnpairedRegionInTriangleLoop(
  partners: PartnersNotation,
  perBaseProps: PerBasePropsArray,
  ur: UnpairedRegion,
): boolean {
  if (isFirstUnpairedRegionInLoop(partners, ur)) {
    let st = containingStem(partners, ur.boundingPosition5);
    if (st) {
      return hasTriangleLoop(perBaseProps, st);
    }
  }
  return false;
}

export function isLastUnpairedRegionInTriangleLoop(
  partners: PartnersNotation,
  perBaseProps: PerBasePropsArray,
  ur: UnpairedRegion,
): boolean {
  if (isLastUnpairedRegionInLoop(partners, ur)) {
    let st = containingStem(partners, ur.boundingPosition3);
    if (st) {
      return hasTriangleLoop(perBaseProps, st);
    }
  }
  return false;
}
