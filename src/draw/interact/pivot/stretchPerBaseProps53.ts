import { PivotingModeInterface as PivotingMode } from './PivotingModeInterface';
import mouseMoveToStretch from './mouseMoveToStretch';
import {
  stretchOfUnpairedRegion,
  UnpairedRegion,
} from './stretchOfUnpairedRegion';
import addStretchToUnpairedRegion from './addStretchToUnpairedRegion';

export function stretchPerBaseProps53(
  mode: PivotingMode,
  ur5: UnpairedRegion,
  ur3: UnpairedRegion,
  xMove: number,
  yMove: number,
) {
  let perBaseProps = mode.strictDrawing.perBaseLayoutProps();
  let s = mouseMoveToStretch(mode, xMove, yMove);
  if (!mode.onlyAddingStretch()) {
    let s3 = stretchOfUnpairedRegion(ur3, perBaseProps);
    let toRemove = Math.min(s3, s);
    addStretchToUnpairedRegion(-toRemove, ur3, perBaseProps);
    s -= toRemove;
  }
  if (s > 0) {
    addStretchToUnpairedRegion(s, ur5, perBaseProps);
  }
  mode.strictDrawing.setPerBaseLayoutProps(perBaseProps);
}

export default stretchPerBaseProps53;
