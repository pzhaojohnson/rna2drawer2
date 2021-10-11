import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
import { EditLayout } from 'Forms/edit/layout/EditLayout';

interface Props {
  app: App;
}

export function EditLayoutButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Layout'}
      onClick={() => {

        // allows form to be reopened
        props.app.unmountCurrForm();

        props.app.renderForm(<EditLayout app={props.app} />);
      }}
    />
  );
}
