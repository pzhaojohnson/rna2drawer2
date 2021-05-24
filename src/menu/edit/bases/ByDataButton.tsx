import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { DroppedButton } from '../../DroppedButton';
import { SelectBasesByData } from '../../../forms/annotate/bases/data/SelectBasesByData';

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
          <SelectBasesByData
            app={props.app}
            close={close}
          />
        ))
      }}
      borderStyle={props.borderStyle}
      borderWidth={props.borderWidth}
      borderColor={props.borderColor}
    />
  );
}
