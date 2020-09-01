import * as React from 'react';
import App from '../../App';
import Dropdown from '../Dropdown';
import TopButton from '../TopButton';

import { ExportSvgButton } from './ExportSvgButton';
import { ExportPptxButton } from './ExportPptxButton';

function createExportDropdownForApp(app: App): React.ReactElement {
  let drawingIsEmpty = app.strictDrawing.isEmpty();
  return (
    <Dropdown
      topButton={
        <TopButton
          text={'Export'}
          disabled={drawingIsEmpty}
        />
      }
      droppedElements={drawingIsEmpty ? [] : [
        <ExportSvgButton app={app} />,
        <ExportPptxButton app={app} />,
      ]}
    />
  );
}

export default createExportDropdownForApp;
