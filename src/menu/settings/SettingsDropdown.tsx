import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import Dropdown from '../Dropdown';
import TopButton from '../TopButton';
import { ComplementRulesButton } from './ComplementRulesButton';

interface Props {
  app: App;
}

export function SettingsDropdown(props: Props): React.ReactElement {
  return (
    <Dropdown
      name={'Settings'}
      dropped={(
        <div>
          <ComplementRulesButton app={props.app} />
        </div>
      )}
      disabled={props.app.strictDrawing.isEmpty()}
    />
  );
}
