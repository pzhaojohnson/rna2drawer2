import {
  setAllBaseHighlightings,
  Drawing,
} from './setAllBaseHighlightings';

function removeAllBaseHighlightings(drawing: Drawing) {
  if (!drawing) {
    return;
  }
  setAllBaseHighlightings(drawing, []);
}

export default removeAllBaseHighlightings;
