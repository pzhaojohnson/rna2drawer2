import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';

export type Props = {
  app: App;
}

export function EditSecondaryBondsButton(props: Props) {
  return (
    <DroppedButton
      text='Secondary Bonds'
      onClick={() => {
        let drawingInteraction = props.app.drawingInteraction;
        let editingTool = drawingInteraction.editingTool;

        if (drawingInteraction.currentTool != editingTool) {
          drawingInteraction.currentTool = editingTool;
        }
        if (editingTool.editingType != SecondaryBond) {
          editingTool.editingType = SecondaryBond;
        }
        editingTool.renderForm();
      }}
    />
  );
}
