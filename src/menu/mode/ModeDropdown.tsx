import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import Dropdown from '../Dropdown';
const uuidv1 = require('uuid/v1');
import TopButton from '../TopButton';
import DroppedSeparator from '../DroppedSeparator';
import { PivotButton } from './PivotButton';
import { ExpandButton } from './ExpandButton';
import { PairComplementsButton } from './PairComplementsButton';
import { ForcePairButton } from './ForcePairButton';
import { AddTertiaryBondsButton } from './AddTertiaryBondsButton';
import { AnnotateButton } from './AnnotateButton';

interface Props {
  app: App;
}

export function ModeDropdown(props: Props): React.ReactElement {
  let drawing = props.app.strictDrawing;
  return (
    <Dropdown
      topButton={
        <TopButton
          text={'Mode'}
          disabled={drawing.isEmpty()}
        />
      }
      droppedElements={drawing.isEmpty() ? [] : [
        <PivotButton app={props.app} />,
        <ExpandButton app={props.app} />,
        <DroppedSeparator key={uuidv1()} />,
        <PairComplementsButton app={props.app} />,
        <ForcePairButton app={props.app} />,
        <AddTertiaryBondsButton app={props.app} />,
        <DroppedSeparator key={uuidv1()} />,
        <AnnotateButton app={props.app} />,
      ]}
    />
  );
}
