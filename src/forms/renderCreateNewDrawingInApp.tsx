import * as React from 'react';
import CreateNewDrawing from './CreateNewDrawing';
import App from '../App';

function renderCreateNewDrawingInApp(app: App) {
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
