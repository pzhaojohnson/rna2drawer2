import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { EditPrimaryBonds } from 'Forms/edit/bonds/primary/EditPrimaryBonds';

export type Props = {
  app: App;
}

export function EditPrimaryBondsButton(props: Props) {
  return (
    <DroppedButton
      text='Primary Bonds'
      onClick={() => {
        props.app.renderForm(unmount => (
          <EditPrimaryBonds
            app={props.app}
            primaryBonds={[...props.app.strictDrawing.drawing.primaryBonds]}
            unmount={unmount}
          />
        ))
      }}
    />
  );
}
