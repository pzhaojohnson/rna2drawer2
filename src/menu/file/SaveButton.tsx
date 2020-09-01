import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';

interface Props {
  app: App;
}

export function SaveButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Save'}
      onClick={() => props.app.save()}
      disabled={props.app.strictDrawing.isEmpty()}
    />
  );
}
