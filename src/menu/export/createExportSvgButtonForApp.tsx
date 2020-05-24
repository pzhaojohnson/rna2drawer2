import * as React from 'react';
const uuidv1 = require('uuid/v1');

import DroppedButton from '../DroppedButton';

import renderExportSvgInApp from '../../forms/renderExportSvgInApp';

interface App {}

function createExportSvgButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'SVG'}
      onClick={() => renderExportSvgInApp(app)}
    />
  );
}

export default createExportSvgButtonForApp;
