import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { DroppedButton } from '../../DroppedButton';
import { BasesByData } from 'Forms/edit/bases/by/data/BasesByData';

interface Props {
  app: App;
  borderStyle?: string;
  borderWidth?: string;
  borderColor?: string;
}

export function ByDataButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'By Data (e.g., SHAPE)'}
      onClick={() => {
        props.app.renderForm(close => (
          <BasesByData
            app={props.app}
            unmount={close}
          />
        ))
      }}
      borderStyle={props.borderStyle}
      borderWidth={props.borderWidth}
      borderColor={props.borderColor}
    />
  );
}
