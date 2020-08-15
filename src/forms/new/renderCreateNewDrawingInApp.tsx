import * as React from 'react';
import CreateNewDrawing from './CreateNewDrawing';
import App from '../../App';

function renderCreateNewDrawingInApp(app: App) {
  app.renderForm(() => (
    <CreateNewDrawing
      width={'100vw'}
      submit={structure => {
        app.strictDrawing.appendStructure(structure);
        if (app.strictDrawing.drawing.numSecondaryBonds == 0) {
          app.strictDrawing.flatOutermostLoop();
          app.strictDrawingInteraction.startFolding();
          app.strictDrawingInteraction.foldingMode.forcePair();
        }
        app.unmountCurrForm();
        app.renderPeripherals();
        app.updateDocumentTitle();
      }}
    />
  ));
}

export default renderCreateNewDrawingInApp;
