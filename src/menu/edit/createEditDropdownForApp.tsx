import * as React from 'react';
const uuidv1 = require('uuid/v1');

import Dropdown from '../Dropdown';
import TopButton from '../TopButton';
import DroppedSeparator from '../DroppedSeparator';

import createUndoButtonForApp from './createUndoButtonForApp';
import createRedoButtonForApp from './createRedoButtonForApp';
import createFlatOutermostLoopButtonForApp from './createFlatOutermostLoopButtonForApp';
import createRoundOutermostLoopButtonForApp from './createRoundOutermostLoopButtonForApp';
import createEditLayoutButtonForApp from './createEditLayoutButtonForApp';

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
        createUndoButtonForApp(app),
        createRedoButtonForApp(app),
        <DroppedSeparator key={uuidv1()} />,
        createFlatOutermostLoopButtonForApp(app),
        createRoundOutermostLoopButtonForApp(app),
        <DroppedSeparator key={uuidv1()} />,
        createEditLayoutButtonForApp(app),
      ]}
    />
  );
}

export default createModeDropdownForApp;
