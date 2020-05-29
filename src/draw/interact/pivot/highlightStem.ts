import { PivotingModeInterface as PivotingMode } from './PivotingModeInterface';
import setAllBaseHighlightings from '../highlight/setAllBaseHighlightings';

export interface Stem {
  position5: number;
  position3: number;
  size: number;
}

export function highlightStem(mode: PivotingMode, st: Stem) {
  let highlightings = [];
  for (let i = 0; i < st.size; i++) {
    let h = {
      fill: '#00ffff',
      fillOpacity: 0.4,
    };
    highlightings[st.position5 + i - 1] = { ...h };
    highlightings[st.position3 - i - 1] = { ...h };
  }
  setAllBaseHighlightings(
    mode.strictDrawing.drawing,
    highlightings,
  );
}

export default highlightStem;
