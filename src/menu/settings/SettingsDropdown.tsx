import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import Dropdown from '../Dropdown';
import TopButton from '../TopButton';
import { ComplementRulesButton } from './ComplementRulesButton';

interface Props {
  app: App;
}

export function SettingsDropdown(props: Props): React.ReactElement {
  let drawing = props.app.strictDrawing;
  return (
    <Dropdown
      topButton={(
        <TopButton
          text={'Settings'}
          disabled={drawing.isEmpty()}
        />
      )}
      dropped={drawing.isEmpty() ? <div></div> : (
        <div>
          <ComplementRulesButton app={props.app} />
        </div>
      )}
    />
  );
}
