import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import IntegerRange from './IntegerRange';
import { selectedRange } from './selected';
import charactersInRange from './charactersInRange';
import areComplementary from './areComplementary';

export function isPairable(mode: FoldingMode, r: IntegerRange): boolean {
  let rSelected = selectedRange(mode);
  if (!rSelected) {
    return false;
  }
  if (rSelected.size != r.size) {
    return false;
  }
  if (rSelected.overlapsWith(r)) {
    return false;
  }
  let csSelected = charactersInRange(mode, rSelected);
  let cs = charactersInRange(mode, r);
  if (mode.pairingComplements() && !areComplementary(csSelected, cs)) {
    return false;
  }
  return true;
}

export default isPairable;
