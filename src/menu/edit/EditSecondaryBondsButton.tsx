import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { EditSecondaryBonds } from 'Forms/edit/bonds/secondary/EditSecondaryBonds';
import { v4 as uuidv4 } from 'uuid';

export type Props = {
  app: App;
}

const formKey = uuidv4();

export function EditSecondaryBondsButton(props: Props) {
  return (
    <DroppedButton
      text='Secondary Bonds'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <EditSecondaryBonds
            {...formProps}
            app={props.app}
            secondaryBonds={[...props.app.strictDrawing.drawing.secondaryBonds]}
          />
        ), { key: formKey });
      }}
    />
  );
}
