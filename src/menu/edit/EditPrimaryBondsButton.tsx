import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { EditPrimaryBonds } from 'Forms/edit/bonds/primary/EditPrimaryBonds';
import { v4 as uuidv4 } from 'uuid';

export type Props = {
  app: App;
}

const formKey = uuidv4();

export function EditPrimaryBondsButton(props: Props) {
  return (
    <DroppedButton
      text='Primary Bonds'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <EditPrimaryBonds
            {...formProps}
            app={props.app}
            primaryBonds={[...props.app.strictDrawing.drawing.primaryBonds]}
          />
        ), { key: formKey });
      }}
    />
  );
}
