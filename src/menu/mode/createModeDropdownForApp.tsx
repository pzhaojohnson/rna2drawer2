import * as React from 'react';

import Dropdown from '../Dropdown';
import TopButton from '../TopButton';

import createPivotButtonForApp from './createPivotButtonForApp';
import createFoldButtonForApp from './createFoldButtonForApp';

interface App {
  strictDrawing: {
    isEmpty: () => boolean;
  }
  strictDrawingInteraction: {
    pivoting: () => boolean;
    startPivoting: () => void;
    folding: () => boolean;
    startFolding: () => void;
  }
}

function createModeDropdownForApp(app: App): React.ReactElement {
  let drawingIsEmpty = app.strictDrawing.isEmpty();
  return (
    <Dropdown
      topButton={
        <TopButton
          text={'Mode'}
          disabled={drawingIsEmpty}
        />
      }
      droppedElements={drawingIsEmpty ? [] : [
        createPivotButtonForApp(app),
        createFoldButtonForApp(app),
      ]}
    />
  );
}

export default createModeDropdownForApp;
