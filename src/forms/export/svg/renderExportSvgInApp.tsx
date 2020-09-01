import * as React from 'react';
import ExportSvg from './ExportSvg';
import { AppInterface as App } from '../../../AppInterface';

function renderExportSvgInApp(app: App) {
  app.renderForm(() => (
    <ExportSvg
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

export default renderExportSvgInApp;
