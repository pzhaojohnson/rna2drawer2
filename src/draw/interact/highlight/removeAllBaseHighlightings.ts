import { DrawingInterface as Drawing } from '../../DrawingInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { removeCircleHighlighting } from 'Draw/bases/annotate/circle/add';

export function removeAllBaseHighlightings(drawing: Drawing) {
  if (!drawing) {
    return;
  }
  drawing.forEachBase((b: Base) => removeCircleHighlighting(b));
}

export default removeAllBaseHighlightings;
