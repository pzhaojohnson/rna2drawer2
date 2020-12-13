import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import { Dropdown } from '../Dropdown';
import DroppedSeparator from '../DroppedSeparator';
import { UndoButton } from './UndoButton';
import { RedoButton } from './RedoButton';
import { EditDrawingTitleButton } from './EditDrawingTitleButton';
import { EditSequenceDropright } from './sequence/EditSequenceDropright';
import { EditBasesDropright } from './bases/EditBasesDropright';
import { EditBaseNumberingButton } from './EditBaseNumberingButton';
import { EditPrimaryBondsButton } from './EditPrimaryBondsButton';
import { EditSecondaryBondsButton } from './EditSecondaryBondsButton';
import { EditTertiaryBondsButton } from './EditTertiaryBondsButton';
import { EditLayoutButton } from './EditLayoutButton';

interface Props {
  app: App;
}

export function EditDropdown(props: Props): React.ReactElement {
  return (
    <Dropdown
      name={'Edit'}
      dropped={(
        <div>
          <UndoButton app={props.app} />
          <RedoButton app={props.app} />
          <DroppedSeparator />
          <EditDrawingTitleButton app={props.app} />
          <DroppedSeparator />
          <EditSequenceDropright app={props.app} />
          <EditBasesDropright app={props.app} />
          <DroppedSeparator />
          <EditPrimaryBondsButton app={props.app} />
          <EditSecondaryBondsButton app={props.app} />
          <EditTertiaryBondsButton app={props.app} />
          <DroppedSeparator />
          <EditBaseNumberingButton app={props.app} />
          <EditLayoutButton app={props.app} />
        </div>
      )}
      disabled={props.app.strictDrawing.isEmpty()}
    />
  );
}
