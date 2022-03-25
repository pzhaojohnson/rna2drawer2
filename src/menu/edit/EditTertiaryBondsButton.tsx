import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

export type Props = {
  app: App;
}

export function EditTertiaryBondsButton(props: Props) {
  return (
    <DroppedButton
      text='Tertiary Bonds'
      onClick={() => {
        if (props.app.strictDrawingInteraction.editingTool.editingType != TertiaryBond) {
          props.app.strictDrawingInteraction.editingTool.editingType = TertiaryBond;
        }
        props.app.strictDrawingInteraction.editingTool.renderForm();
      }}
    />
  );
}
