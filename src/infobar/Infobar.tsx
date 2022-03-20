import * as React from 'react';
import styles from './Infobar.css';
import { AppInterface as App } from 'AppInterface';
import { BindingToolControls } from 'Infobar/tools/bind/BindingToolControls';
import { ZoomAdjust } from './zoom/ZoomAdjust';

export type Props = {
  app: App;
}

export function Infobar(props: Props) {
  let strictDrawingInteraction = props.app.strictDrawingInteraction;
  let currentTool = strictDrawingInteraction.currentTool;
  let bindingTool = strictDrawingInteraction.bindingTool;

  return props.app.strictDrawing.isEmpty() ? null : (
    <div className={styles.infobar} >
      <div style={{ width: '8px' }} />
      {currentTool != bindingTool ? null : <BindingToolControls app={props.app} />}
      <div className={styles.spacer} />
      <ZoomAdjust app={props.app} />
    </div>
  );
}
