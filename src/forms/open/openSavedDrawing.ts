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

export type Args = {
  /**
   * A reference to the whole app.
   */
  app: App;

  extension: string;
  contents: string;
}

function openRna2drawer1(args: Args): boolean {
  let { app, extension, contents } = args;

  let rna2drawer1 = parseRna2drawer1(contents);
  if (rna2drawer1) {
    addRna2drawer1(app.strictDrawing, rna2drawer1);
    app.refresh();
    return true;
  }
  return false;
}

function openRna2drawer2(args: Args): boolean {
  let { app, extension, contents } = args;

  try {
    let savedState = JSON.parse(contents);
    let applied = app.strictDrawing.applySavedState(savedState as StrictDrawingSavableState);
    if (applied) {
      app.strictDrawing.updateLayout(); // adjust padding of drawing for current screen
      removeAllBaseHighlightings(app.drawing);
      return true;
    }
  } catch (err) {}
  return false;
}

/**
 * Throws if the saved drawing is invalid.
 */
export function openSavedDrawing(args: Args): void | never {
  let { app, extension, contents } = args;

  let fe = extension.toLowerCase();

  if (fe.toLowerCase().indexOf('rna2drawer') != 0) {
    throw new Error('File must have .rna2drawer extension.');
  }

  let opened = false;

  if (fe == 'rna2drawer') {
    opened = openRna2drawer1(args);
  } else if (fe == 'rna2drawer2') {
    opened = openRna2drawer2(args);
  }

  if (!opened) {
    throw new Error('Invalid .rna2drawer file.');
  }
}
