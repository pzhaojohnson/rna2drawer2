import { DrawingInterface as Drawing } from '../../DrawingInterface';
import { BaseInterface as Base } from '../../BaseInterface';

export function removeAllBaseHighlightings(drawing: Drawing) {
  if (!drawing) {
    return;
  }
  drawing.forEachBase((b: Base) => b.removeHighlighting());
}

export default removeAllBaseHighlightings;
