import React from 'react';
import ExportPptx from './ExportPptx';

function renderExportPptxInApp(app) {
  app.renderForm(() => (
    <ExportPptx
      SVG={() => app.SVG()}
      getSvgString={() => app.strictDrawing.svgString}
      close={() => app.unmountCurrForm()}
    />
  ));
}

export default renderExportPptxInApp;
