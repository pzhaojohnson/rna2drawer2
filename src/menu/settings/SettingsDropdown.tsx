import * as React from 'react';
import Dropdown from '../Dropdown';
import TopButton from '../TopButton';
import ComplementRulesButton from './ComplementRulesButton';
import App from '../../App';

export function SettingsDropdown(app: App): React.ReactElement {
  return (
    <Dropdown
      topButton={(
        <TopButton
          text={'Settings'}
          disabled={app.strictDrawing.isEmpty()}
        />
      )}
      droppedElements={app.strictDrawing.isEmpty() ? [] : [
        ComplementRulesButton(app),
      ]}
    />
  );
}

export default SettingsDropdown;
