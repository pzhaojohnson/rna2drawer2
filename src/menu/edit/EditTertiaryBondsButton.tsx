import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';

interface Props {
  app: App;
}

export function EditTertiaryBondsButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Tertiary Bonds'}
      onClick={() => {
        props.app.strictDrawingInteraction.tertiaryBondsInteraction.requestToRenderForm();
      }}
    />
  );
}
