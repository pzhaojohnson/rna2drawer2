import * as React from 'react';
const uuidv1 = require('uuid/v1');

import DroppedButton from '../DroppedButton';

import renderExportPptxInApp from '../../forms/renderExportPptxInApp';
import App from '../../App';

function createExportPptxButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'PowerPoint (PPTX)'}
      onClick={() => renderExportPptxInApp(app)}
    />
  );
}

export default createExportPptxButtonForApp;
