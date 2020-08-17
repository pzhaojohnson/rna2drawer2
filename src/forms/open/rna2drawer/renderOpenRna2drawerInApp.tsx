import * as React from 'react';
import OpenRna2drawer from './OpenRna2drawer';
import App from '../../../App';
import { StrictDrawingSavableState } from '../../../draw/StrictDrawingInterface';
import parseRna2drawer1 from './parseRna2drawer1';
import addRna2drawer1 from './addRna2drawer1';

function openRna2drawer1(app: App, saved: string): boolean {
  let rna2drawer1 = parseRna2drawer1(saved);
  if (rna2drawer1) {
    addRna2drawer1(app.strictDrawing, rna2drawer1);
    return true;
  }
  return false;
}

function openRna2drawer2(app: App, saved: string): boolean {
  try {
    let savedState = JSON.parse(saved);
    let applied = app.strictDrawing.applySavedState(savedState as StrictDrawingSavableState);
    if (applied) {
      app.strictDrawing.refreshIds(); // required for SVG ID generator to work correctly
      app.strictDrawing.applyLayout(); // adjust padding of drawing to current screen
      return true;
    }
  } catch (err) {}
  return false;
}

function renderOpenRna2drawerInApp(app: App) {
  app.renderForm(() => (
    <OpenRna2drawer
      submit={(saved: string, fileExtension: string) => {
        fileExtension = fileExtension.toLowerCase();
        let opened = false;
        if (fileExtension.toLowerCase() == 'rna2drawer') {
          opened = openRna2drawer1(app, saved);
        } else if (fileExtension.toLowerCase() == 'rna2drawer2') {
          opened = openRna2drawer2(app, saved);
        }
        if (opened) {
          app.unmountCurrForm();
          app.drawingChangedNotByInteraction();
          return true;
        }
        return false;
      }}
    />
  ));
}

export default renderOpenRna2drawerInApp;
