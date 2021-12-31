import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { ExportDrawing } from 'Forms/export/drawing/ExportDrawing';

export type Props = {
  app: App;
}

export function ExportPptxButton(props: Props) {
  return (
    <DroppedButton
      text='PowerPoint (PPTX)'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <ExportDrawing
            {...formProps}
            app={props.app}
            format='pptx'
          />
        ));
      }}
    />
  );
}
