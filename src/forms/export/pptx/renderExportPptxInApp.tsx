import * as React from 'react';
import ExportPptx from './ExportPptx';
import App from '../../../App';

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
