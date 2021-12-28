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
        props.app.renderForm(formProps => (
          <ExportDrawing
            app={props.app}
            format='svg'
            unmount={formProps.unmount}
          />
        ));
      }}
    />
  );
}
