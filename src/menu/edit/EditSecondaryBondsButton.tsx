import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { EditSecondaryBondsForm } from 'Forms/edit/bonds/secondary/EditSecondaryBondsForm';
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
          <EditSecondaryBondsForm
            {...formProps}
            app={props.app}
            secondaryBonds={[...props.app.strictDrawing.drawing.secondaryBonds]}
          />
        ), { key: formKey });
      }}
    />
  );
}
