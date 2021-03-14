import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import { Dropdown } from '../Dropdown';
import { ComplementRulesButton } from './ComplementRulesButton';
import { DeselectOnDblclickButton } from './DeselectOnDblclickButton';
import { DelayedPivotingButton } from './DelayedPivotingButton';

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
          <DeselectOnDblclickButton app={props.app} />
          <DelayedPivotingButton app={props.app} />
        </div>
      )}
      disabled={props.app.strictDrawing.isEmpty()}
    />
  );
}
