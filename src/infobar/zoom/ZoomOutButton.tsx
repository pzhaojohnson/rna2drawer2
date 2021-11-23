import * as React from 'react';
import styles from './ZoomOutButton.css';
import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { zoom, setZoom } from 'Draw/zoom';
import minus from './minus.svg';
import { nextLowestPresetZoom } from './control';

function zoomOut(drawing: Drawing) {
  let z = zoom(drawing);
  if (typeof z != 'number') {
    setZoom(drawing, 1); // reset zoom
  } else {
    let nextLowest = nextLowestPresetZoom(z);
    if (typeof nextLowest == 'number') {
      setZoom(drawing, nextLowest);
    }
  }
}

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
