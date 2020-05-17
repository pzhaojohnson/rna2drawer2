import React from 'react';
import OpenRna2drawer from './OpenRna2drawer';

/**
 * @param {App} app 
 */
function renderOpenRna2drawerInApp(app) {
  app.renderForm(
    <OpenRna2drawer
      submit={savedState => {
        let applied = app.strictDrawing.applySavedState(savedState);
        if (applied) {
          app.unmountCurrForm();
          app.renderPeripherals();
          app.updateDocumentTitle();
        }
        return applied;
      }}
    />
  );
}

export default renderOpenRna2drawerInApp;
