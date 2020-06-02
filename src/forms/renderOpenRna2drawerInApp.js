import React from 'react';
import OpenRna2drawer from './OpenRna2drawer';

/**
 * @param {App} app 
 */
function renderOpenRna2drawerInApp(app) {
  app.renderForm(() => (
    <OpenRna2drawer
      submit={savedState => {
        let applied = app.strictDrawing.applySavedState(savedState);
        if (applied) {

          // needed for the SVG ID generator function to work correctly
          app.strictDrawing.refreshIds();

          // adjusts padding of drawing to current screen
          app.strictDrawing.applyLayout();
          
          app.unmountCurrForm();
          app.renderPeripherals();
          app.updateDocumentTitle();
        }
        return applied;
      }}
    />
  ));
}

export default renderOpenRna2drawerInApp;
