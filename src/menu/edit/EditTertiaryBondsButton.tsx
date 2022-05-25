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
        let drawingInteraction = props.app.drawingInteraction;
        let editingTool = drawingInteraction.editingTool;

        if (drawingInteraction.currentTool != editingTool) {
          drawingInteraction.currentTool = editingTool;
        }
        if (editingTool.editingType != TertiaryBond) {
          editingTool.editingType = TertiaryBond;
        }
        editingTool.renderForm();
      }}
    />
  );
}
