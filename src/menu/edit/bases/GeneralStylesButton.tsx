import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { DroppedButton } from '../../DroppedButton';
import { GeneralBaseStyles } from '../../../forms/edit/bases/generalStyles/GeneralBaseStyles';

interface Props {
  app: App;
}

export function GeneralStylesButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text='General Styles'
      onClick={() => {
        props.app.renderForm(close => (
          <GeneralBaseStyles
            app={props.app}
            bases={props.app.strictDrawing.drawing.bases()}
            unmount={close}
          />
        ))
      }}
    />
  );
}
