import { AnnotatingModeInterface as AnnotatingMode } from './AnnotatingModeInterface';
import { highlightBase, HighlightingProps } from '../highlight/highlightBase';

let selectedProps = { fill: '#ff0000', fillOpacity: 0.75 };

function _highlightBases(mode: AnnotatingMode, highlightings: HighlightingProps[]) {
  mode.selected.forEach(p => {
    highlightings[p - 1] = { ...selectedProps };
  });
  if (mode.hovered) {
    highlightings[mode.hovered - 1] = { ...selectedProps };
  }
}

export function setAllBaseHighlightings(mode: AnnotatingMode) {
  let highlightings = [] as HighlightingProps[];
  _highlightBases(mode, highlightings);
  mode.drawing.forEachBase((b, p) => {
    let props = highlightings[p - 1];
    if (props) {
      highlightBase(b, {
        ...props,
        radius: 0.5 * b.fontSize,
      });
    } else {
      b.removeHighlighting();
    }
  });
}

export default setAllBaseHighlightings;
