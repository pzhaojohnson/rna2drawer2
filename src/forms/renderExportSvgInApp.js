import React from 'react';
import ExportSvg from './ExportSvg';

function renderExportSvgInApp(app) {
  app.renderForm(
    <ExportSvg
      SVG={() => app.SVG()}
      getSvgString={() => app.strictDrawing.svgString}
      close={() => app.unmountCurrForm()}
    />
  )
}

export default renderExportSvgInApp;
