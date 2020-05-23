import * as React from 'react';

import Dropdown from './Dropdown';
import TopButton from './TopButton';
import DroppedButton from './DroppedButton';
import DroppedSeparator from './DroppedSeparator';

import renderEditLayoutInApp from '../forms/renderEditLayoutInApp';

interface App {
  strictDrawing: {
    isEmpty: () => boolean;
    hasFlatOutermostLoop: () => boolean;
    flatOutermostLoop: () => void;
    hasRoundOutermostLoop: () => boolean;
    roundOutermostLoop: () => void;
  }
  undo: () => void;
  canUndo: () => boolean;
  redo: () => void;
  canRedo: () => boolean;
  pushUndo: () => void;
  drawingChangedNotByInteraction: () => void;
}

function createModeDropdownForApp(app: App): React.ReactElement {
  let drawingIsEmpty = app.strictDrawing.isEmpty();
  return (
    <Dropdown
      topButton={
        <TopButton
          text={'Edit'}
          disabled={drawingIsEmpty}
        />
      }
      droppedElements={drawingIsEmpty ? [] : [
        <DroppedButton
          text={'Undo'}
          onClick={() => app.undo()}
          disabled={!app.canUndo()}
          keyBinding={'Ctrl+Z'}
        />,
        <DroppedButton
          text={'Redo'}
          onClick={() => app.redo()}
          disabled={!app.canRedo()}
          keyBinding={'Ctrl+Shift+Z'}
        />,
        <DroppedSeparator />,
        <DroppedButton
          text={'Flat Outermost Loop'}
          onClick={() => {
            if (app.strictDrawing.hasFlatOutermostLoop()) {
              return;
            }
            app.pushUndo();
            app.strictDrawing.flatOutermostLoop();
            app.drawingChangedNotByInteraction();
          }}
          disabled={app.strictDrawing.hasFlatOutermostLoop()}
          checked={app.strictDrawing.hasFlatOutermostLoop()}
        />,
        <DroppedButton
          text={'Round Outermost Loop'}
          onClick={() => {
            if (app.strictDrawing.hasRoundOutermostLoop()) {
              return;
            }
            app.pushUndo();
            app.strictDrawing.roundOutermostLoop();
            app.drawingChangedNotByInteraction();
          }}
          disabled={app.strictDrawing.hasRoundOutermostLoop()}
          checked={app.strictDrawing.hasRoundOutermostLoop()}
        />,
        <DroppedSeparator />,
        <DroppedButton
          text={'Layout'}
          onClick={() => renderEditLayoutInApp(app)}
        />,
      ]}
    />
  );
}

export default createModeDropdownForApp;
