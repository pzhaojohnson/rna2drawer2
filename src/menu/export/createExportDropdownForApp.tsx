import * as React from 'react';

import Dropdown from '../Dropdown';
import TopButton from '../TopButton';

import createExportSvgButtonForApp from './createExportSvgButtonForApp';
import createExportPptxButtonForApp from './createExportPptxButtonForApp';

import App from '../../App';

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
        createExportSvgButtonForApp(app),
        createExportPptxButtonForApp(app),
      ]}
    />
  );
}

export default createExportDropdownForApp;
