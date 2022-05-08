import * as React from 'react';
import { Dropdown } from 'Menu/Dropdown';
import { DroppedSeparator } from 'Menu/DroppedSeparator';
import type { App } from 'App';
import { WelcomeButton } from './WelcomeButton';
import { NewButton } from './NewButton';
import { OpenButton } from './OpenButton';
import { SaveButton } from './SaveButton';

export type Props = {
  app: App;
}

export function FileDropdown(props: Props) {
  return (
    <Dropdown
      name='File'
      dropped={
        <div style={{ width: '287px', display: 'flex', flexDirection: 'column' }} >
          <WelcomeButton app={props.app} />
          <DroppedSeparator />
          <NewButton app={props.app} />
          <OpenButton app={props.app} />
          <SaveButton app={props.app} />
        </div>
      }
    />
  );
}
