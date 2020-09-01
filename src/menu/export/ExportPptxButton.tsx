import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
import renderExportPptxInApp from '../../forms/export/pptx/renderExportPptxInApp';

interface Props {
  app: App;
}

export function ExportPptxButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'PowerPoint (PPTX)'}
      onClick={() => renderExportPptxInApp(props.app)}
    />
  );
}
