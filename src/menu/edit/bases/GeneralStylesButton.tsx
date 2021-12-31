import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { GeneralBaseStyles } from 'Forms/edit/bases/GeneralBaseStyles';

export type Props = {
  app: App;
}

export function GeneralStylesButton(props: Props) {
  return (
    <DroppedButton
      text='General Styles'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <GeneralBaseStyles
            {...formProps}
            app={props.app}
            bases={props.app.strictDrawing.drawing.bases()}
          />
        ))
      }}
    />
  );
}
