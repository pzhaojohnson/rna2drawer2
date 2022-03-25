import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { ExportDrawing } from 'Forms/export/drawing/ExportDrawing';
import { v4 as uuidv4 } from 'uuid';

export type Props = {
  app: App;
}

const formKey = uuidv4();

export function ExportSvgButton(props: Props) {
  return (
    <DroppedButton
      text='SVG'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <ExportDrawing
            {...formProps}
            app={props.app}
            format='svg'
          />
        ), { key: formKey });
      }}
    />
  );
}
