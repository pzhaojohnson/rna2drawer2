import type { App } from 'App';

import * as React from 'react';
import { EditingTypeSelect } from './EditingTypeSelect';

export type Props = {
  app: App; // a reference to the whole app
};

export function EditingToolControls(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <div style={{ width: '5px' }} />
      <EditingTypeSelect app={props.app} />
    </div>
  );
}
