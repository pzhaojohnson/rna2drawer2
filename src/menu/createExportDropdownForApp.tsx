import * as React from 'react';

import Dropdown from './Dropdown';
import TopButton from './TopButton';
import DroppedButton from './DroppedButton';

import renderExportSvgInApp from '../forms/renderExportSvgInApp';
import renderExportPptxInApp from '../forms/renderExportPptxInApp';

interface App {
  strictDrawing: {
    isEmpty: () => boolean;
  }
}

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
        <DroppedButton
          text={'SVG'}
          onClick={() => renderExportSvgInApp(app)}
        />,
        <DroppedButton
          text={'PowerPoint (PPTX)'}
          onClick={() => renderExportPptxInApp(app)}
        />
      ]}
    />
  );
}

export default createExportDropdownForApp;
