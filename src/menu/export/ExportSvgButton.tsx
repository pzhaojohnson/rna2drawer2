import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { ExportDrawing } from 'Forms/export/drawing/ExportDrawing';

export type Props = {
  app: App;
}

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
        ));
      }}
    />
  );
}
