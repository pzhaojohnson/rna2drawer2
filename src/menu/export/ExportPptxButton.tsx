import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { ExportDrawingForm } from 'Forms/export/drawing/ExportDrawingForm';
import { v4 as uuidv4 } from 'uuid';

export type Props = {
  app: App;
}

const formKey = uuidv4();

export function ExportPptxButton(props: Props) {
  return (
    <DroppedButton
      text='PowerPoint (PPTX)'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <ExportDrawingForm
            {...formProps}
            app={props.app}
            format='pptx'
          />
        ), { key: formKey });
      }}
    />
  );
}
