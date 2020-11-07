import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { DroppedButton } from '../../DroppedButton';

interface Props {
  app: App;
  borderStyle?: string;
  borderWidth?: string;
  borderColor?: string;
}

export function BySelectionButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'By Selection'}
      onClick={() => {
        props.app.strictDrawingInteraction.startAnnotating();
        props.app.strictDrawingInteraction.annotatingMode.requestToRenderForm();
      }}
      borderStyle={props.borderStyle}
      borderWidth={props.borderWidth}
      borderColor={props.borderColor}
    />
  );
}
