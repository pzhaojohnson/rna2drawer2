import { PivotingModeInterface as PivotingMode } from './PivotingModeInterface';
import stemOfPosition from '../../../parse/stemOfPosition';
import unpairedRegion5 from './unpairedRegion5';
import unpairedRegion3 from './unpairedRegion3';
import shouldPivot53 from './shouldPivot53';
import stretchPerBaseProps53 from './stretchPerBaseProps53';
import stretchPerBaseProps35 from './stretchPerBaseProps35';

export function pivot(mode: PivotingMode, xMove: number, yMove: number) {
  if (!mode.selectedPosition) {
    return;
  }
  let partners = mode.strictDrawing.layoutPartners();
  let st = stemOfPosition(mode.selectedPosition, partners);
  if (!st) {
    return;
  }
  if (!mode.pivoted) {
    mode.fireShouldPushUndo();
    mode.pivoted = true;
  }
  let ur5 = unpairedRegion5(st, partners);
  let ur3 = unpairedRegion3(st, partners);
  if (shouldPivot53(mode, st, xMove, yMove)) {
    stretchPerBaseProps53(mode, ur5, ur3, xMove, yMove);
  } else {
    stretchPerBaseProps35(mode, ur5, ur3, xMove, yMove);
  }
  mode.strictDrawing.applyLayout();
}

export default pivot;
