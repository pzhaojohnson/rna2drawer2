import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import hoveredComplement from './hoveredComplement';
import {
  canSecondaryPair,
  secondaryPair,
} from './secondaryPair';
import tertiaryPair from './tertiaryPair';

export function pair(mode: FoldingMode) {
  let comp = hoveredComplement(mode);
  if (!mode.selected || !comp) {
    return;
  }
  if (canSecondaryPair(mode)) {
    secondaryPair(mode);
  } else {
    tertiaryPair(mode);
  }
}

export default pair;
