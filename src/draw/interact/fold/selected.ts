import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import IntegerRange from './IntegerRange';
import charactersInRange from './charactersInRange';

export function minSelected(mode: FoldingMode): number {
  if (!mode.selected) {
    return NaN;
  }
  return Math.min(mode.selected.tightEnd, mode.selected.looseEnd);
}

export function maxSelected(mode: FoldingMode): number {
  if (!mode.selected) {
    return NaN;
  }
  return Math.max(mode.selected.tightEnd, mode.selected.looseEnd);
}

export function selectedRange(mode: FoldingMode): (IntegerRange | null) {
  if (!mode.selected) {
    return null;
  }
  return new IntegerRange(
    minSelected(mode),
    maxSelected(mode),
  );
}

export function selectedCharacters(mode: FoldingMode): string {
  let r = selectedRange(mode);
  if (!r) {
    return '';
  }
  return charactersInRange(mode, r);
}
