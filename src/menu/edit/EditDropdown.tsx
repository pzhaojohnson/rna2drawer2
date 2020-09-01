import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import Dropdown from '../Dropdown';
import TopButton from '../TopButton';
import DroppedSeparator from '../DroppedSeparator';
import { UndoButton } from './UndoButton';
import { RedoButton } from './RedoButton';
import { CapitalizeButton } from './CapitalizeButton';
import { DecapitalizeButton } from './DecapitalizeButton';
import { TsToUsButton } from './TsToUsButton';
import { UsToTsButton } from './UsToTsButton';
import { EditSequenceIdButton } from './EditSequenceIdButton';
import { EditBaseNumberingButton } from './EditBaseNumberingButton';
import { EditTertiaryBondsButton } from './EditTertiaryBondsButton';
import { EditLayoutButton } from './EditLayoutButton';

interface Props {
  app: App;
}

export function EditDropdown(props: Props): React.ReactElement {
  let drawing = props.app.strictDrawing;
  return (
    <Dropdown
      topButton={
        <TopButton
          text={'Edit'}
          disabled={drawing.isEmpty()}
        />
      }
      dropped={drawing.isEmpty() ? <div></div> : (
        <div>
          <UndoButton app={props.app} />
          <RedoButton app={props.app} />
          <DroppedSeparator />
          <CapitalizeButton app={props.app} />
          <DecapitalizeButton app={props.app} />
          <TsToUsButton app={props.app} />
          <UsToTsButton app={props.app} />
          <DroppedSeparator />
          <EditSequenceIdButton app={props.app} />
          <EditBaseNumberingButton app={props.app} />
          <EditTertiaryBondsButton app={props.app} />
          <EditLayoutButton app={props.app} />
        </div>
      )}
    />
  );
}
