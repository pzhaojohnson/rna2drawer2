import * as React from 'react';
import styles from './Infobar.css';
import { useState } from 'react';
import { AppInterface as App } from 'AppInterface';
import { ToolSelect } from 'Infobar/tools/ToolSelect';
import { BindingToolControls } from 'Infobar/tools/bind/BindingToolControls';
import { ZoomAdjust } from './zoom/ZoomAdjust';

export type Props = {
  app: App;
}

export function Infobar(props: Props) {
  let [toolSelectIsOpen, setToolSelectIsOpen] = useState(false);

  let strictDrawingInteraction = props.app.strictDrawingInteraction;
  let currentTool = strictDrawingInteraction.currentTool;
  let bindingTool = strictDrawingInteraction.bindingTool;

  return props.app.strictDrawing.isEmpty() ? null : (
    <div className={styles.infobar} >
      <div style={{ width: '6px' }} />
      <ToolSelect
        app={props.app}
        onOpen={() => setToolSelectIsOpen(true)}
        onClose={() => setToolSelectIsOpen(false)}
      />
      {toolSelectIsOpen || currentTool != bindingTool ? null : (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
          <div style={{ width: '8px' }} />
          <BindingToolControls app={props.app} />
        </div>
      )}
      <div className={styles.spacer} />
      <ZoomAdjust app={props.app} />
    </div>
  );
}
