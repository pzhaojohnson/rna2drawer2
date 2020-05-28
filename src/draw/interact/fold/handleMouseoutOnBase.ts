import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import Base from '../../Base';
import setAllBaseHighlightings from './setAllBaseHighlightings';

export function handleMouseoutOnBase(mode: FoldingMode, b: Base) {
  mode.hovered = null;
  setAllBaseHighlightings(mode);
}

export default handleMouseoutOnBase;
