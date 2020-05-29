import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import canSecondaryPair from './canSecondaryPair';
import secondaryPair from './secondaryPair';
import tertiaryPair from './tertiaryPair';

export function pair(mode: FoldingMode) {
  if (canSecondaryPair(mode)) {
    secondaryPair(mode);
  } else {
    tertiaryPair(mode);
  }
}

export default pair;
