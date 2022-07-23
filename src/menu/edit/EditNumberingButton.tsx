import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { BaseNumbering } from 'Draw/bases/numberings/BaseNumbering';

export type Props = {
  app: App;
}

export function EditNumberingButton(props: Props) {
  return (
    <DroppedButton
      text='Numbering'
      onClick={() => {
        let drawingInteraction = props.app.drawingInteraction;
        let editingTool = drawingInteraction.editingTool;

        if (drawingInteraction.currentTool != editingTool) {
          drawingInteraction.currentTool = editingTool;
        }
        if (editingTool.editingType != BaseNumbering) {
          editingTool.editingType = BaseNumbering;
        }
        editingTool.renderForm();
      }}
    />
  );
}
