import * as React from 'react';
import { Dropdown } from 'Menu/Dropdown';
import { DroppedSeparator } from 'Menu/DroppedSeparator';
import type { App } from 'App';
import { UndoButton } from './UndoButton';
import { RedoButton } from './RedoButton';
import { EditDrawingTitleButton } from './EditDrawingTitleButton';
import { EditSequenceDropright } from './sequence/EditSequenceDropright';
import { EditBasesDropright } from './bases/EditBasesDropright';
import { EditNumberingButton } from './EditNumberingButton';
import { EditPrimaryBondsButton } from './EditPrimaryBondsButton';
import { EditSecondaryBondsButton } from './EditSecondaryBondsButton';
import { EditTertiaryBondsButton } from './EditTertiaryBondsButton';
import { ApplySubstructureButton } from './ApplySubstructureButton';
import { EditLayoutButton } from './EditLayoutButton';

export type Props = {
  app: App;
}

export function EditDropdown(props: Props) {
  return (
    <Dropdown
      name='Edit'
      dropped={(
        <div style={{ width: '301px', display: 'flex', flexDirection: 'column' }} >
          <UndoButton app={props.app} />
          <RedoButton app={props.app} />
          <DroppedSeparator />
          <EditDrawingTitleButton app={props.app} />
          <DroppedSeparator />
          <EditSequenceDropright app={props.app} />
          <EditBasesDropright app={props.app} />
          <DroppedSeparator />
          <EditPrimaryBondsButton app={props.app} />
          <DroppedSeparator />
          <EditSecondaryBondsButton app={props.app} />
          <EditTertiaryBondsButton app={props.app} />
          <ApplySubstructureButton app={props.app} />
          <DroppedSeparator />
          <EditNumberingButton app={props.app} />
          <EditLayoutButton app={props.app} />
        </div>
      )}
      disabled={props.app.strictDrawing.isEmpty()}
    />
  );
}
