import { PivotingModeInterface as PivotingMode } from './PivotingModeInterface';
import mouseMoveToStretch from './mouseMoveToStretch';
import {
  stretchOfUnpairedRegion,
  UnpairedRegion,
} from './stretchOfUnpairedRegion';
import addStretchToUnpairedRegion from './addStretchToUnpairedRegion';

export function stretchPerBaseProps35(
  mode: PivotingMode,
  ur5: UnpairedRegion,
  ur3: UnpairedRegion,
  xMove: number,
  yMove: number,
) {
  let perBaseProps = mode.strictDrawing.perBaseLayoutProps();
  let s = mouseMoveToStretch(mode, xMove, yMove);
  if (!mode.onlyAddingStretch()) {
    let s5 = stretchOfUnpairedRegion(ur5, perBaseProps);
    let toRemove = Math.min(s5, s);
    addStretchToUnpairedRegion(-toRemove, ur5, perBaseProps);
    s -= toRemove;
  }
  if (s > 0) {
    addStretchToUnpairedRegion(s, ur3, perBaseProps);
  }
  mode.strictDrawing.setPerBaseLayoutProps(perBaseProps);
}

export default stretchPerBaseProps35;
