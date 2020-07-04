import * as React from 'react';
const uuidv1 = require('uuid/v1');

import Dropdown from '../Dropdown';
import TopButton from '../TopButton';
import DroppedSeparator from '../DroppedSeparator';

import createUndoButtonForApp from './createUndoButtonForApp';
import createRedoButtonForApp from './createRedoButtonForApp';
import createCapitalizeButtonForApp from './createCapitalizeButtonForApp';
import createDecapitalizeButtonForApp from './createDecapitalizeButtonForApp';
import createTsToUsButtonForApp from './createTsToUsButtonForApp';
import createUsToTsButtonForApp from './createUsToTsButtonForApp';
import createEditSequenceIdButtonForApp from './createEditSequenceIdButtonForApp';
import createEditBaseNumberingButtonForApp from './createEditBaseNumberingButtonForApp';
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
        createTsToUsButtonForApp(app),
        createUsToTsButtonForApp(app),
        <DroppedSeparator key={uuidv1()} />,
        createEditSequenceIdButtonForApp(app),
        createEditBaseNumberingButtonForApp(app),
        createEditLayoutButtonForApp(app),
      ]}
    />
  );
}

export default createModeDropdownForApp;
