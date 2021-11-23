import * as React from 'react';
import styles from './ZoomAdjust.css';
import { AppInterface as App } from 'AppInterface';
import { ZoomDisplay } from './ZoomDisplay';
import { ZoomInButton } from './ZoomInButton';
import { ZoomOutButton } from './ZoomOutButton';

export interface Props {
  app: App;
}

export function ZoomAdjust(props: Props) {
  return (
    <div className={styles.zoomAdjust} >
      <ZoomOutButton {...props} />
      <ZoomDisplay {...props} />
      <ZoomInButton {...props} />
    </div>
  );
}
