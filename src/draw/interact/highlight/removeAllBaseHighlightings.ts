import Drawing from '../../Drawing';
import setAllBaseHighlightings from './setAllBaseHighlightings';

export function removeAllBaseHighlightings(drawing: Drawing) {
  if (!drawing) {
    return;
  }
  setAllBaseHighlightings(drawing, []);
}

export default removeAllBaseHighlightings;
