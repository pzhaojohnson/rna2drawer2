import * as React from 'react';

import Dropdown from './Dropdown';
import TopButton from './TopButton';
import DroppedButton from './DroppedButton';

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
        <DroppedButton
          text={'Pivot'}
          onClick={() => {
            if (app.strictDrawingInteraction.pivoting()) {
              return;
            }
            app.strictDrawingInteraction.startPivoting();
          }}
          disabled={app.strictDrawingInteraction.pivoting()}
          checked={app.strictDrawingInteraction.pivoting()}
        />,
        <DroppedButton
          text={'Fold'}
          onClick={() => {
            if (app.strictDrawingInteraction.folding()) {
              return;
            }
            app.strictDrawingInteraction.startFolding();
          }}
          disabled={app.strictDrawingInteraction.folding()}
          checked={app.strictDrawingInteraction.folding()}
        />,
      ]}
    />
  );
}

export default createModeDropdownForApp;
