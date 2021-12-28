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
        props.app.renderForm(formProps => (
          <ExportDrawing
            app={props.app}
            format='pptx'
            unmount={formProps.unmount}
          />
        ));
      }}
    />
  );
}
