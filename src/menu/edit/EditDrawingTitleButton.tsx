import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { DrawingTitleForm } from 'Forms/edit/drawing-title/DrawingTitleForm';
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
          <DrawingTitleForm {...formProps} app={props.app} />
        ), { key: formKey });
      }}
    />
  );
}
