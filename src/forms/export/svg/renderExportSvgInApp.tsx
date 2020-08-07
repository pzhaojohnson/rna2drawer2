import * as React from 'react';
import ExportSvg from './ExportSvg';
import App from '../../../App';

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
