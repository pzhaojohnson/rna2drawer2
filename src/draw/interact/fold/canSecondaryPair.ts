import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import selectedAreSecondaryUnpaired from './selectedAreSecondaryUnpaired';
import hoveredComplement from './hoveredComplement';
import isKnotless from '../../../parse/isKnotless';

export function canSecondaryPair(mode: FoldingMode): boolean {
  if (!mode.selected) {
    return false;
  }
  if (!selectedAreSecondaryUnpaired(mode)) {
    return false;
  }
  let comp = hoveredComplement(mode);
  if (!comp) {
    return false;
  }
  let partners = mode.strictDrawing.layoutPartners();
  for (let i = 0; i < mode.selectedLength; i++) {
    partners[(mode.minSelected as number) + i - 1] = comp.position3 - i;
    partners[comp.position3 - i - 1] = (mode.minSelected as number) + i;
  }
  return isKnotless(partners);
}

export default canSecondaryPair;
