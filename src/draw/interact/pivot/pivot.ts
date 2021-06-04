import {
  PivotingModeInterface as PivotingMode,
  UnpairedRegion,
} from './PivotingModeInterface';
import { Partners as PartnersNotation } from 'Partners/Partners';
import {
  PerBaseStrictLayoutProps as PerBaseProps,
  PerBaseStrictLayoutPropsArray as PerBasePropsArray,
} from '../../layout/singleseq/strict/PerBaseStrictLayoutProps';
import {
  Movement,
  normalizedMagnitudeOfMovement,
  movementIsOutward,
  movementIsInward,
  movementIsUpstream,
  movementIsDownstream,
} from './movement';
import {
  unpairedRegionBefore,
  unpairedRegionAfter,
  hasTriangleLoop,
  isFirstUnpairedRegionInTriangleLoop,
  isLastUnpairedRegionInTriangleLoop,
} from './loop';
import {
  stretchOfUnpairedRegion,
  addStretchEvenly,
} from '../../layout/singleseq/strict/stretch';
import { closestStemOuterTo } from '../../../parse/closest';

export function pivot(mode: PivotingMode, move: Movement) {
  if (mode.selected) {
    let partners = mode.strictDrawing.layoutPartners();
    let perBaseProps = mode.strictDrawing.perBaseLayoutProps();
    let outerStem = closestStemOuterTo(partners, mode.selected.position5);
    let inTriangleLoop = outerStem ? hasTriangleLoop(perBaseProps, outerStem) : false;
    if (inTriangleLoop && outerStem && movementIsOutward(mode, outerStem, move)) {
      pivotOutward(mode, move);
    } else if (inTriangleLoop && outerStem && movementIsInward(mode, outerStem, move)) {
      pivotInward(mode, move);
    } else if (movementIsUpstream(mode, move)) {
      pivotUpstream(mode, move);
    } else if (movementIsDownstream(mode, move)) {
      pivotDownstream(mode, move);
    }
  }
}

function canBeStretched(partners: PartnersNotation, perBaseProps: PerBasePropsArray, ur: UnpairedRegion): boolean {
  return !isFirstUnpairedRegionInTriangleLoop(partners, perBaseProps, ur)
    && !isLastUnpairedRegionInTriangleLoop(partners, perBaseProps, ur);
}

/**
 * Returns how much the unpaired region was stretched.
 */
function stretchUnpairedRegion(perBaseProps: PerBasePropsArray, ur: UnpairedRegion, stretch: number): number {
  if (stretch < 0) {
    let toAdd = Math.max(
      stretch,
      -stretchOfUnpairedRegion(perBaseProps, ur),
    );
    addStretchEvenly(perBaseProps, ur, toAdd);
    return toAdd;
  } else {
    addStretchEvenly(perBaseProps, ur, stretch);
    return stretch;
  }
}

function pivotOutward(mode: PivotingMode, move: Movement) {
  if (mode.selected) {
    let mag = normalizedMagnitudeOfMovement(mode, move);
    let partners = mode.strictDrawing.layoutPartners();
    let perBaseProps = mode.strictDrawing.perBaseLayoutProps();
    let outerStem = closestStemOuterTo(partners, mode.selected.position5);
    if (outerStem) {
      let props = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, outerStem.position5);
      props.triangleLoopHeight += mag;
      mode.strictDrawing.setPerBaseLayoutProps(perBaseProps);
      mode.strictDrawing.updateLayout({ onlyMove: mode.onlyMoving, updatePadding: false });
    }
  }
}

function pivotInward(mode: PivotingMode, move: Movement) {
  if (mode.selected) {
    let mag = normalizedMagnitudeOfMovement(mode, move);
    let partners = mode.strictDrawing.layoutPartners();
    let perBaseProps = mode.strictDrawing.perBaseLayoutProps();
    let outerStem = closestStemOuterTo(partners, mode.selected.position5);
    if (outerStem) {
      let props = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, outerStem.position5);
      props.triangleLoopHeight = Math.max(
        props.triangleLoopHeight - mag,
        1,
      );
      mode.strictDrawing.setPerBaseLayoutProps(perBaseProps);
      mode.strictDrawing.updateLayout({ onlyMove: mode.onlyMoving, updatePadding: false });
    }
  }
}

function pivotUpstream(mode: PivotingMode, move: Movement) {
  if (mode.selected) {
    let mag = normalizedMagnitudeOfMovement(mode, move);
    let partners = mode.strictDrawing.layoutPartners();
    let perBaseProps = mode.strictDrawing.perBaseLayoutProps();
    let ur5 = unpairedRegionBefore(partners, mode.selected);
    let ur3 = unpairedRegionAfter(partners, mode.selected);
    if (!mode.onlyAddingStretch() && canBeStretched(partners, perBaseProps, ur5)) {
      mag += stretchUnpairedRegion(perBaseProps, ur5, -mag);
    }
    if (canBeStretched(partners, perBaseProps, ur3)) {
      stretchUnpairedRegion(perBaseProps, ur3, mag);
    }
    mode.strictDrawing.setPerBaseLayoutProps(perBaseProps);
    mode.strictDrawing.updateLayout({ onlyMove: mode.onlyMoving, updatePadding: false });
  }
}

function pivotDownstream(mode: PivotingMode, move: Movement) {
  if (mode.selected) {
    let mag = normalizedMagnitudeOfMovement(mode, move);
    let partners = mode.strictDrawing.layoutPartners();
    let perBaseProps = mode.strictDrawing.perBaseLayoutProps();
    let ur5 = unpairedRegionBefore(partners, mode.selected);
    let ur3 = unpairedRegionAfter(partners, mode.selected);
    if (!mode.onlyAddingStretch() && canBeStretched(partners, perBaseProps, ur3)) {
      mag += stretchUnpairedRegion(perBaseProps, ur3, -mag);
    }
    if (canBeStretched(partners, perBaseProps, ur5)) {
      stretchUnpairedRegion(perBaseProps, ur5, mag);
    }
    mode.strictDrawing.setPerBaseLayoutProps(perBaseProps);
    mode.strictDrawing.updateLayout({ onlyMove: mode.onlyMoving, updatePadding: false });
  }
}
