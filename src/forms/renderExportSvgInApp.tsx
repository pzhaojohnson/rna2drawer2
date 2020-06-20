import * as React from 'react';
import ExportSvg from './ExportSvg';
import App from '../App';

function renderExportSvgInApp(app: App) {
  app.renderForm(() => (
    <ExportSvg
      SVG={() => app.SVG()}
      getSvgString={() => app.strictDrawing.svgString}
      close={() => app.unmountCurrForm()}
    />
  ));
}

export default renderExportSvgInApp;
