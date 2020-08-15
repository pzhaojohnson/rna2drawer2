import * as React from 'react';
const uuidv1 = require('uuid/v1');
import DroppedButton from '../DroppedButton';
import ComplementRules from '../../forms/settings/complements/ComplementRules';
import App from '../../App';

export function ComplementRulesButton(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Complement Rules'}
      onClick={() => {
        app.renderForm(() => ComplementRules(app));
      }}
    />
  );
}

export default ComplementRulesButton;
