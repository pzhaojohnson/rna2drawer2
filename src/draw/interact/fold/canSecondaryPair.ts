import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import { selectedRange } from './selected';
import hoveredPairable from './hoveredPairable';
import secondaryBondsWith from './secondaryBondsWith';
import { partnersAreValid } from '../../../parse/partnersAreValid';
import isKnotless from '../../../parse/isKnotless';

export function canSecondaryPair(mode: FoldingMode): boolean {
  if (mode.onlyAddingTertiaryBonds()) {
    return false;
  }
  let rSelected = selectedRange(mode);
  if (!rSelected || secondaryBondsWith(mode, rSelected).length > 0) {
    return false;
  }
  let pairable = hoveredPairable(mode);
  if (!pairable || secondaryBondsWith(mode, pairable).length > 0) {
    return false;
  }
  let partners = mode.strictDrawing.layoutPartners();
  for (let i = 0; i < rSelected.size; i++) {
    partners[rSelected.start + i - 1] = pairable.end - i;
    partners[pairable.end - i - 1] = rSelected.start + i;
  }
  return partnersAreValid(partners) && isKnotless(partners);
}

export default canSecondaryPair;
