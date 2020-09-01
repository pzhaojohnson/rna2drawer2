import * as React from 'react';
import ExportPptx from './ExportPptx';
import { AppInterface as App } from '../../../AppInterface';

function renderExportPptxInApp(app: App) {
  app.renderForm(() => (
    <ExportPptx
      SVG={() => app.SVG()}
      getSvgString={() => {

        // removes base highlighting, which may not be exportable
        app.strictDrawingInteraction.reset();

        return app.strictDrawing.svgString;
      }}
      close={() => app.unmountCurrForm()}
    />
  ));
}

export default renderExportPptxInApp;
