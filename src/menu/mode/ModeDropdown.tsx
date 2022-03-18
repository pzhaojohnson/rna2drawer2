import * as React from 'react';
import { Dropdown } from 'Menu/Dropdown';
import { AppInterface as App } from 'AppInterface';
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
          <AnnotateButton app={props.app} />
        </div>
      )}
      disabled={props.app.strictDrawing.isEmpty()}
    />
  );
}
