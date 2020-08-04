import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import {
  unpairedRegionOfPosition,
  UnpairedRegion,
} from '../../../parse/unpairedRegionOfPosition';
import {
  stemOfPosition,
  Stem,
} from '../../../parse/stemOfPosition';
import { PerBaseStrictLayoutProps as PerBaseProps } from '../../layout/singleseq/strict/PerBaseStrictLayoutProps';

function _positionsWithStrectch3(ur: UnpairedRegion): number[] {
  let ps = [] as number[];
  for (let p = ur.boundingPosition5; p < ur.boundingPosition3; p++) {
    if (p > 0) {
      ps.push(p);
    }
  }
  return ps;
}

function _evenOutStretch(ur: UnpairedRegion, perBaseProps: PerBaseProps[]) {
  let ps = _positionsWithStrectch3(ur);
  let totalStretch = 0;
  ps.forEach(p => {
    let props = perBaseProps[p - 1];
    if (props) {
      totalStretch += props.stretch3;
    }
  });
  let s = ps.length == 0 ? 0 : totalStretch / ps.length;
  ps.forEach(p => {
    let props = perBaseProps[p - 1];
    if (props) {
      props.stretch3 = s;
    }
  });
}

function _removeStretchBetweenBasePairs(st: Stem, perBaseProps: PerBaseProps[]) {
  for (let i = 0; i < st.size - 1; i++) {
    let p5 = st.position5 + i;
    let props5 = perBaseProps[p5 - 1];
    if (props5) {
      props5.stretch3 = 0;
    }
  }
  for (let i = 0; i < st.size - 1; i++) {
    let p3 = (st.position3 - 1) - i;
    let props3 = perBaseProps[p3 - 1];
    if (props3) {
      props3.stretch3 = 0;
    }
  }
}

export function adjustStretches(mode: FoldingMode) {
  let partners = mode.strictDrawing.layoutPartners();
  let perBaseProps = mode.strictDrawing.perBaseLayoutProps();
  let numBases = mode.strictDrawing.drawing.numBases;
  let p = 1;
  while (p <= numBases) {
    let ur = unpairedRegionOfPosition(p, partners);
    let st = stemOfPosition(p, partners);
    if (ur) {
      _evenOutStretch(ur, perBaseProps);
      // guarantees no infinite looping
      p = Math.max(ur.boundingPosition3, p + 1);
    } else if (st) {
      _removeStretchBetweenBasePairs(st, perBaseProps);
      // guarantees no infinite looping
      p = Math.max(p + st.size, p + 1);
    }
  }
  mode.strictDrawing.setPerBaseLayoutProps(perBaseProps);
}

export default adjustStretches;
