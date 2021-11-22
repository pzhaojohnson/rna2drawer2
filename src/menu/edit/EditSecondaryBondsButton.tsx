import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { EditSecondaryBonds } from 'Forms/edit/bonds/secondary/EditSecondaryBonds';

export type Props = {
  app: App;
}

export function EditSecondaryBondsButton(props: Props) {
  return (
    <DroppedButton
      text='Secondary Bonds'
      onClick={() => {
        props.app.renderForm(unmount => (
          <EditSecondaryBonds
            app={props.app}
            secondaryBonds={[...props.app.strictDrawing.drawing.secondaryBonds]}
            unmount={unmount}
          />
        ))
      }}
    />
  );
}
