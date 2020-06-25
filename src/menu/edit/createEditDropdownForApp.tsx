import * as React from 'react';
const uuidv1 = require('uuid/v1');

import Dropdown from '../Dropdown';
import TopButton from '../TopButton';
import DroppedSeparator from '../DroppedSeparator';

import createUndoButtonForApp from './createUndoButtonForApp';
import createRedoButtonForApp from './createRedoButtonForApp';
import createCapitalizeButtonForApp from './createCapitalizeButtonForApp';
import createDecapitalizeButtonForApp from './createDecapitalizeButtonForApp';
import createFlatOutermostLoopButtonForApp from './createFlatOutermostLoopButtonForApp';
import createRoundOutermostLoopButtonForApp from './createRoundOutermostLoopButtonForApp';
import createEditLayoutButtonForApp from './createEditLayoutButtonForApp';

import App from '../../App';

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
        createCapitalizeButtonForApp(app),
        createDecapitalizeButtonForApp(app),
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
