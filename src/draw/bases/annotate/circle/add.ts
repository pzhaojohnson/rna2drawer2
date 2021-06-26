import { CircleBaseAnnotationInterface as CircleBaseAnnotation } from './CircleBaseAnnotationInterface';
import { BaseInterface as Base } from 'Draw/BaseInterface';

function remove(cba: CircleBaseAnnotation) {
  cba.circle.remove();
}

export function removeOutline(b: Base) {
  if (b.outline) {
    remove(b.outline);
    b.outline = undefined;
  }
}

export function removeHighlighting(b: Base) {
  if (b.highlighting) {
    remove(b.highlighting);
    b.highlighting = undefined;
  }
}
