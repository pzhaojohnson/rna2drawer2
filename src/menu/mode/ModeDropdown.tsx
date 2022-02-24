import * as React from 'react';
import { Dropdown } from 'Menu/Dropdown';
import { DroppedSeparator } from 'Menu/DroppedSeparator';
import { AppInterface as App } from 'AppInterface';
import { PivotButton } from './PivotButton';
import { ExpandButton } from './ExpandButton';
import { PairComplementsButton } from './PairComplementsButton';
import { ForcePairButton } from './ForcePairButton';
import { AddTertiaryBondsButton } from './AddTertiaryBondsButton';
import { TriangularizeButton } from './TriangularizeButton';
import { AnnotateButton } from './AnnotateButton';

export type Props = {
  app: App;
}

export function ModeDropdown(props: Props) {
  return (
    <Dropdown
      name='Mode'
      dropped={(
        <div style={{ width: '256px', display: 'flex', flexDirection: 'column' }} >
          <PivotButton app={props.app} />
          <ExpandButton app={props.app} />
          <DroppedSeparator />
          <PairComplementsButton app={props.app} />
          <ForcePairButton app={props.app} />
          <AddTertiaryBondsButton app={props.app} />
          <DroppedSeparator />
          <TriangularizeButton app={props.app} />
          <DroppedSeparator />
          <AnnotateButton app={props.app} />
        </div>
      )}
      disabled={props.app.strictDrawing.isEmpty()}
    />
  );
}
