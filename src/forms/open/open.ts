import type { App } from 'App';
import { parseRna2drawer1 } from './parseRna2drawer1';
import { addRna2drawer1 } from './addRna2drawer1';
import { StrictDrawingSavableState } from 'Draw/strict/StrictDrawingInterface';

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
      return true;
    }
  } catch (err) {}
  return false;
}

export function open(app: App, saved: Saved): boolean {
  let fe = saved.extension.toLowerCase();
  if (fe == 'rna2drawer') {
    return openRna2drawer1(app, saved);
  } else if (fe == 'rna2drawer2') {
    return openRna2drawer2(app, saved);
  } else {
    return false;
  }
}
