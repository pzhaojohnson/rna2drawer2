import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import { Dropdown } from '../Dropdown';
import { DroppedSeparator } from '../DroppedSeparator';
import { HomeButton } from './HomeButton';
import { NewButton } from './NewButton';
import { OpenButton } from './OpenButton';
import { SaveButton } from './SaveButton';

interface Props {
  app: App;
}

export function FileDropdown(props: Props): React.ReactElement {
  return (
    <Dropdown
      name={'File'}
      dropped={
        <div>
          <HomeButton app={props.app} />
          <DroppedSeparator />
          <NewButton app={props.app} />
          <OpenButton app={props.app} />
          <SaveButton app={props.app} />
        </div>
      }
    />
  );
}
