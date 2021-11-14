import * as React from 'react';
import styles from './ZoomOutButton.css';
import { AppInterface as App } from 'AppInterface';
import minus from './minus.svg';
import { zoomOut } from './control';

export interface Props {
  app: App;
}

export function ZoomOutButton(props: Props) {
  return (
    <div
      className={styles.zoomOutButton}
      onClick={() => {
        zoomOut(props.app.strictDrawing.drawing);
        props.app.refresh();
      }}
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '2px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        className={'unselectable'}
        src={minus}
        alt='Minus'
        style={{
          width: '8px',
        }}
      />
    </div>
  );
}
