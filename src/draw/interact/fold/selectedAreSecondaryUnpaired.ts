import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';

export function selectedAreSecondaryUnpaired(mode: FoldingMode): boolean {
  if (!mode.selected) {
    return false;
  }
  let partners = mode.strictDrawing.layoutPartners();
  for (let p = mode.minSelected as number; p <= (mode.maxSelected as number); p++) {
    if (partners[p - 1]) {
      return false;
    }
  }
  return true;
}

export default selectedAreSecondaryUnpaired;
