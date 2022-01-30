import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';

export type Props = {
  app: App;
}

export function EditTertiaryBondsButton(props: Props) {
  return (
    <DroppedButton
      text='Tertiary Bonds'
      onClick={() => {
        props.app.strictDrawingInteraction.tertiaryBondsInteraction.renderForm();
      }}
    />
  );
}
