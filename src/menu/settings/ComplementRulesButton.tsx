import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
const uuidv1 = require('uuid/v1');
import { ComplementRules } from '../../forms/settings/complements/ComplementRules';

interface Props {
  app: App;
}

export function ComplementRulesButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Complement Rules'}
      onClick={() => {
        props.app.renderForm(() => ComplementRules(props.app));
      }}
    />
  );
}
