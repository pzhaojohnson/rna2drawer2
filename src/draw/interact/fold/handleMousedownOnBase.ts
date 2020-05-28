import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import Base from '../../Base';
import hoveredComplement from './hoveredComplement';
import pair from './pair';
import selectedAreUnpaired from './selectedAreUnpaired';
import unpair from './unpair';
import setAllBaseHighlightings from './setAllBaseHighlightings';

export function handleMousedownOnBase(mode: FoldingMode, b: Base) {
  if (mode.hoveringSelected()) {
    if (!selectedAreUnpaired(mode)) {
      unpair(mode);
    }
    return;
  }
  let comp = hoveredComplement(mode);
  if (comp) {
    pair(mode);
    return;
  }
  mode.selected = {
    tightEnd: mode.hovered,
    looseEnd: mode.hovered,
  };
  mode.startSelecting();
  setAllBaseHighlightings(mode);
}

export default handleMousedownOnBase;
