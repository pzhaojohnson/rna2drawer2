import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';

export type Props = {
  app: App;
}

export function EditPrimaryBondsButton(props: Props) {
  return (
    <DroppedButton
      text='Primary Bonds'
      onClick={() => {
        let drawingInteraction = props.app.drawingInteraction;
        let editingTool = drawingInteraction.editingTool;

        if (drawingInteraction.currentTool != editingTool) {
          drawingInteraction.currentTool = editingTool;
        }
        if (editingTool.editingType != PrimaryBond) {
          editingTool.editingType = PrimaryBond;
        }
        editingTool.renderForm();
      }}
    />
  );
}
