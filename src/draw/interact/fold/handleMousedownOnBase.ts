import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import Base from '../../Base';
import hoveredComplement from './hoveredComplement';
import pair from './pair';
import selectedAreSecondaryUnpaired from './selectedAreSecondaryUnpaired';
import secondaryUnpair from './secondaryUnpair';
import setAllBaseHighlightings from './setAllBaseHighlightings';

export function handleMousedownOnBase(mode: FoldingMode, b: Base) {
  if (mode.hoveringSelected()) {
    if (!selectedAreSecondaryUnpaired(mode)) {
      secondaryUnpair(mode);
    }
    return;
  }
  let comp = hoveredComplement(mode);
  if (comp) {
    pair(mode);
    return;
  }
  if (!mode.hovered) {
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
