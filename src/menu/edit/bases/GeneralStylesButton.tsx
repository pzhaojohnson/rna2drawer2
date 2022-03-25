import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { GeneralBaseStyles } from 'Forms/edit/bases/GeneralBaseStyles';
import { v4 as uuidv4 } from 'uuid';

export type Props = {
  app: App;
}

const formKey = uuidv4();

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
        ), { key: formKey });
      }}
    />
  );
}
