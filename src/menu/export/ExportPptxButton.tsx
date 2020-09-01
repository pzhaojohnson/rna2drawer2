import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
const uuidv1 = require('uuid/v1');
import renderExportPptxInApp from '../../forms/export/pptx/renderExportPptxInApp';

interface Props {
  app: App;
}

export function ExportPptxButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'PowerPoint (PPTX)'}
      onClick={() => renderExportPptxInApp(props.app)}
    />
  );
}
