import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import highlightBase from '../highlight/highlightBase';
import areComplementary from './areComplementary';

interface Complement {
  position5: number;
  position3: number;
}

function highlightComp(mode: FoldingMode, comp: Complement) {
  let drawing = mode.strictDrawing.drawing;
  for (let p = comp.position5; p <= comp.position3; p++) {
    let b = drawing.getBaseAtOverallPosition(p);
    if (b) {
      highlightBase(b, {
        fill: '#0000ff',
        fillOpacity: 0.15,
      });
    }
  }
}

export function highlightComplements(mode: FoldingMode) {
  if (!mode.selected) {
    return;
  }
  let overall = mode.strictDrawing.drawing.overallCharacters;
  let selected = overall.substring(
    mode.minSelected - 1,
    mode.maxSelected,
  );
  for (let p5 = 1; p5 <= overall.length - selected.length; p5++) {
    let p3 = p5 + selected.length - 1;
    let complementary = areComplementary(selected, overall.substring(p5 - 1, p3));
    let overlapsSelected = mode.overlapsSelected(p5, p3);
    if (complementary && !overlapsSelected) {
      highlightComp(mode, {
        position5: p5,
        position3: p3,
      });
    }
  }
}

export default highlightComplements;
