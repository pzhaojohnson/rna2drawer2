import * as React from 'react';
import ExportPptx from './ExportPptx';
import App from '../App';

function renderExportPptxInApp(app: App) {
  app.renderForm(() => (
    <ExportPptx
      SVG={() => app.SVG()}
      getSvgString={() => app.strictDrawing.svgString}
      close={() => app.unmountCurrForm()}
    />
  ));
}

export default renderExportPptxInApp;
