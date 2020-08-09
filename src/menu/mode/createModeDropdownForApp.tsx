import * as React from 'react';
const uuidv1 = require('uuid/v1');

import Dropdown from '../Dropdown';
import TopButton from '../TopButton';
import DroppedSeparator from '../DroppedSeparator';

import createPivotButtonForApp from './createPivotButtonForApp';
import createExpandButtonForApp from './createExpandButtonForApp';
import PairComplementsButton from './PairComplementsButton';
import ForcePairButton from './ForcePairButton';
import AddTertiaryBondsButton from './AddTertiaryBondsButton';
import AnnotateButton from './AnnotateButton';

import App from '../../App';

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
        createExpandButtonForApp(app),
        <DroppedSeparator key={uuidv1()} />,
        PairComplementsButton(app),
        ForcePairButton(app),
        AddTertiaryBondsButton(app),
        <DroppedSeparator key={uuidv1()} />,
        AnnotateButton(app),
      ]}
    />
  );
}

export default createModeDropdownForApp;
