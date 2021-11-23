import * as React from 'react';
import styles from './ZoomAdjust.css';
import { AppInterface as App } from 'AppInterface';
import { ZoomDisplay } from './ZoomDisplay';
import { ZoomInButton } from './ZoomInButton';
import { ZoomOutButton } from './ZoomOutButton';

export type Props = {
  app: App;
}

export function ZoomAdjust(props: Props) {
  return (
    <div className={styles.zoomAdjust} >
      <ZoomOutButton app={props.app} />
      <ZoomDisplay app={props.app} />
      <ZoomInButton app={props.app} />
    </div>
  );
}
