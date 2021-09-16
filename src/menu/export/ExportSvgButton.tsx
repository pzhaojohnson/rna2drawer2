import * as React from 'react';
import { AppInterface as App } from 'AppInterface';
import { DroppedButton } from 'Menu/DroppedButton';
import { ExportDrawing } from 'Forms/export/drawing/ExportDrawing';

export interface Props {
  app: App;
}

export function ExportSvgButton(props: Props) {
  return (
    <DroppedButton
      text='SVG'
      onClick={() => props.app.renderForm(() => (
        <ExportDrawing
          app={props.app}
          format='svg'
          close={() => props.app.unmountCurrForm()}
        />
      ))}
    />
  );
}
