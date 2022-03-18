import * as React from 'react';
import { Dropdown } from 'Menu/Dropdown';
import { AppInterface as App } from 'AppInterface';
import { ComplementRulesButton } from './ComplementRulesButton';

export type Props = {
  app: App;
}

export function SettingsDropdown(props: Props) {
  return (
    <Dropdown
      name='Settings'
      dropped={
        <div style={{ width: '256px', display: 'flex', flexDirection: 'column' }} >
          <ComplementRulesButton app={props.app} />
        </div>
      }
      disabled={props.app.strictDrawing.isEmpty()}
    />
  );
}
