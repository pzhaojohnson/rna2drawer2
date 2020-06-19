import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import {
  unpairedRegionOfPosition,
  UnpairedRegion,
} from "../../../parse/unpairedRegionOfPosition";

export interface PerBaseProps {
  stretch3: number;
}

function evenOutStretch(ur: UnpairedRegion, perBaseProps: PerBaseProps[]) {
  let s = 0;
  for (let p = ur.boundingPosition5; p < ur.boundingPosition3; p++) {
    if (p > 0) {
      let props = perBaseProps[p - 1];
      if (props) {
        s += props.stretch3;
      }
    }
  }
  let size = ur.boundingPosition3 - ur.boundingPosition5;
  if (ur.boundingPosition5 == 0) {
    size--;
  }
  if (size < 1) {
    return;
  }
  for (let p = ur.boundingPosition5; p < ur.boundingPosition3; p++) {
    if (p > 0) {
      let props = perBaseProps[p - 1];
      if (props) {
        props.stretch3 = s / size;
      }
    }
  }
}

export function evenOutStretches(mode: FoldingMode) {
  let partners = mode.strictDrawing.layoutPartners();
  let perBaseProps = mode.strictDrawing.perBaseLayoutProps();
  let p = 1;
  while (p <= partners.length) {
    while (partners[p - 1]) {
      p++;
    }
    let ur = unpairedRegionOfPosition(p, partners) as UnpairedRegion;
    evenOutStretch(ur, perBaseProps);
    p = ur.boundingPosition3;
  }
  mode.strictDrawing.setPerBaseLayoutProps(perBaseProps);
}

export default evenOutStretches;
