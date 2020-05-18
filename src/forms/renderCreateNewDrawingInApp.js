import React from 'react';
import CreateNewDrawing from './CreateNewDrawing';

/**
 * @param {App} app 
 */
function renderCreateNewDrawingInApp(app) {
  app.renderForm(() => (
    <CreateNewDrawing
      width={'100vw'}
      submit={structure => {
        app.strictDrawing.appendStructure(structure);
        app.unmountCurrForm();
        app.renderPeripherals();
        app.updateDocumentTitle();
      }}
    />
  ));
}

export default renderCreateNewDrawingInApp;
