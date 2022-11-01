import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { Base } from 'Draw/bases/Base';

export type Props = {
  app: App;
}

export function BySelectionButton(props: Props) {
  return (
    <DroppedButton
      text='By Selection'
      onClick={() => {
        let drawingInteraction = props.app.strictDrawingInteraction;
        drawingInteraction.currentTool = drawingInteraction.editingTool;
        drawingInteraction.editingTool.editingType = Base;
        drawingInteraction.editingTool.renderForm();
      }}
      style={{ borderRadius: '0px 4px 0px 0px' }}
    />
  );
}
