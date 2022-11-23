import type { App } from 'App';
import type { Drawing } from 'Draw/Drawing';
import type { StrictDrawing } from 'Draw/strict/StrictDrawing';

import { parseRna2drawer1 } from './parseRna2drawer1';
import { addRna2drawer1 } from './addRna2drawer1';
import { StrictDrawingSavableState } from 'Draw/strict/StrictDrawing';

import { removeCircleHighlighting } from 'Draw/bases/annotate/circle/add';

import { parseFileExtension } from 'Parse/parseFileExtension';

// no highlightings from user interaction should carry over
// when opening a saved drawing
function removeAllBaseHighlightings(drawing: Drawing | StrictDrawing) {
  drawing.bases().forEach(b => removeCircleHighlighting(b));
}

function openRna2drawer1(
  args: {
    app: App,
    contents: string,
  },
): boolean {
  let { app, contents } = args;

  let rna2drawer1 = parseRna2drawer1(contents);
  if (rna2drawer1) {
    addRna2drawer1(app.strictDrawing, rna2drawer1);
    app.refresh();
    return true;
  }
  return false;
}

function openRna2drawer2(
  args: {
    app: App,
    contents: string,
  },
): boolean {
  let { app, contents } = args;

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

export type Args = {
  /**
   * A reference to the whole app.
   */
  app: App;

  savedDrawing: File;
}

/**
 * Asynchronously opens the saved drawing.
 *
 * Fails if the saved drawing is invalid (i.e., the returned promise is
 * rejected).
 */
export function openSavedDrawing(args: Args) {
  let { app, savedDrawing } = args;

  let fileName = savedDrawing.name;
  let fileExtension = parseFileExtension(fileName);

  return new Promise<void>((resolve, reject) => {
    if (fileExtension.toLowerCase().indexOf('rna2drawer') != 0) {
      reject(new Error('File must have .rna2drawer extension.'));
    }

    savedDrawing.text().then(text => {
      let opened = false;
      if (fileExtension.toLowerCase() == 'rna2drawer') {
        opened = openRna2drawer1({ app, contents: text });
      } else if (fileExtension.toLowerCase() == 'rna2drawer2') {
        opened = openRna2drawer2({ app, contents: text });
      }

      if (!opened) {
        throw new Error('Invalid .rna2drawer file.');
      }

      resolve();
    }).catch(reject);
  });
}
