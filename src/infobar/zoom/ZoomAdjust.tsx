import * as React from 'react';
import styles from './ZoomAdjust.css';
import { AppInterface as App } from 'AppInterface';
import { ZoomInput } from './ZoomInput';
import { v4 as uuidv4 } from 'uuid';
import { ZoomInButton } from './ZoomInButton';
import { ZoomOutButton } from './ZoomOutButton';

export type Props = {
  app: App;
}

export function ZoomAdjust(props: Props) {
  return (
    <div className={styles.zoomAdjust} >
      <ZoomOutButton app={props.app} />
      <ZoomInput
        key={uuidv4()} // seems to be necessary for the input value to be updated
        app={props.app}
      />
      <ZoomInButton app={props.app} />
    </div>
  );
}
