import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import Dropdown from '../Dropdown';
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
      dropped={drawing.isEmpty() ? <div></div> : (
        <div>
          <PivotButton app={props.app} />
          <ExpandButton app={props.app} />
          <DroppedSeparator />
          <PairComplementsButton app={props.app} />
          <ForcePairButton app={props.app} />
          <AddTertiaryBondsButton app={props.app} />
          <DroppedSeparator />
          <AnnotateButton app={props.app} />
        </div>
      )}
    />
  );
}
