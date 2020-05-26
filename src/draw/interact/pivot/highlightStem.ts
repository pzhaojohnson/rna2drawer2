import {
  setAllBaseHighlightings,
  Drawing,
} from '../highlight/setAllBaseHighlightings';

interface Stem {
  position5: number;
  position3: number;
  size: number;
}

function highlightStem(st: Stem, drawing: Drawing) {
  if (!st || !drawing) {
    return;
  }
  let highlightings = [];
  for (let i = 0; i < st.size; i++) {
    let h = {
      fill: '#00ffff',
      fillOpacity: 0.5,
    };
    highlightings[st.position5 + i - 1] = { ...h };
    highlightings[st.position3 - i - 1] = { ...h };
  }
  setAllBaseHighlightings(drawing, highlightings);
}

export default highlightStem;
