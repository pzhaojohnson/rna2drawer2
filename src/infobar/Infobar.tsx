import * as React from 'react';
import styles from './Infobar.css';
import { AppInterface as App } from 'AppInterface';
import { ZoomAdjust } from './zoom/ZoomAdjust';

export type Props = {
  app: App;
}

export function Infobar(props: Props) {
  return props.app.strictDrawing.isEmpty() ? null : (
    <div className={styles.infobar} >
      <div className={styles.spacer} />
      <ZoomAdjust app={props.app} />
    </div>
  );
}
