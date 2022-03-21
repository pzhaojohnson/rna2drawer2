import * as React from 'react';
import styles from './Infobar.css';
import { AppInterface as App } from 'AppInterface';
import { ToolControls } from 'Infobar/tools/ToolControls';
import { ZoomAdjust } from './zoom/ZoomAdjust';

export type Props = {
  app: App;
}

export function Infobar(props: Props) {
  return props.app.strictDrawing.isEmpty() ? null : (
    <div className={styles.infobar} >
      <div style={{ width: '6px' }} />
      <ToolControls app={props.app} />
      <div className={styles.spacer} />
      <ZoomAdjust app={props.app} />
    </div>
  );
}
