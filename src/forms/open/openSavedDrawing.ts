import type { App } from 'App';
import type { Drawing } from 'Draw/Drawing';
import type { StrictDrawing } from 'Draw/strict/StrictDrawing';

import { parseRna2drawer1 } from './parseRna2drawer1';
import { addRna2drawer1 } from './addRna2drawer1';
import { StrictDrawingSavableState } from 'Draw/strict/StrictDrawing';

import { removeCircleHighlighting } from 'Draw/bases/annotate/circle/add';

// no highlightings from user interaction should carry over
// when opening a saved drawing
function removeAllBaseHighlightings(drawing: Drawing | StrictDrawing) {
  drawing.bases().forEach(b => removeCircleHighlighting(b));
}

interface Saved {
  extension: string;
  contents: string;
}

function openRna2drawer1(app: App, saved: Saved): boolean {
  let rna2drawer1 = parseRna2drawer1(saved.contents);
  if (rna2drawer1) {
    addRna2drawer1(app.strictDrawing, rna2drawer1);
    app.refresh();
    return true;
  }
  return false;
}

function openRna2drawer2(app: App, saved: Saved): boolean {
  try {
    let savedState = JSON.parse(saved.contents);
    let applied = app.strictDrawing.applySavedState(savedState as StrictDrawingSavableState);
    if (applied) {
      app.strictDrawing.updateLayout(); // adjust padding of drawing for current screen
      removeAllBaseHighlightings(app.drawing);
      return true;
    }
  } catch (err) {}
  return false;
}

export function openSavedDrawing(app: App, saved: Saved): boolean {
  let fe = saved.extension.toLowerCase();
  if (fe == 'rna2drawer') {
    return openRna2drawer1(app, saved);
  } else if (fe == 'rna2drawer2') {
    return openRna2drawer2(app, saved);
  } else {
    return false;
  }
}
