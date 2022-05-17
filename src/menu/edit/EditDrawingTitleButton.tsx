import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { EditDrawingTitleForm } from 'Forms/edit/title/EditDrawingTitleForm';
import { v4 as uuidv4 } from 'uuid';

export type Props = {
  app: App;
}

const formKey = uuidv4();

export function EditDrawingTitleButton(props: Props) {
  return (
    <DroppedButton
      text='Drawing Title'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <EditDrawingTitleForm {...formProps} app={props.app} />
        ), { key: formKey });
      }}
    />
  );
}
