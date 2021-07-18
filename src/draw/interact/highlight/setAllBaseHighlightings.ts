import Drawing from '../../Drawing';
import { Base } from 'Draw/bases/Base';
import {
  highlightBase,
  HighlightingProps,
} from './highlightBase';
import { removeCircleHighlighting } from 'Draw/bases/annotate/circle/add';

export function setAllBaseHighlightings(drawing: Drawing, props: HighlightingProps[]) {
  if (!drawing || !props) {
    return;
  }
  drawing.forEachBase((b: Base, p: number) => {
    let ps = props[p - 1];
    if (!ps) {
      removeCircleHighlighting(b);
    } else {
      highlightBase(b, ps);
    }
  });
}

export default setAllBaseHighlightings;
