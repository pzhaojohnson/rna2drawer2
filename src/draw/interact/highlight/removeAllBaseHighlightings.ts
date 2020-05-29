import Drawing from '../../Drawing';
import Base from '../../Base';

export function removeAllBaseHighlightings(drawing: Drawing) {
  if (!drawing) {
    return;
  }
  drawing.forEachBase((b: Base) => b.removeHighlighting());
}

export default removeAllBaseHighlightings;
