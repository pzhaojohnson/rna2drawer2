import * as React from 'react';
import styles from './ZoomInButton.css';
import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { zoom, setZoom } from 'Draw/zoom';
import plus from './plus.svg';
import { nextHighestPresetZoom } from './presetZooms';

function zoomIn(drawing: Drawing) {
  let z = zoom(drawing);
  if (typeof z != 'number') {
    setZoom(drawing, 1); // reset zoom
  } else {
    let nextHighest = nextHighestPresetZoom(z);
    if (typeof nextHighest == 'number') {
      setZoom(drawing, nextHighest);
    }
  }
}

export interface Props {
  app: App;
}

export function ZoomInButton(props: Props) {
  return (
    <div
      className={styles.zoomInButton}
      onClick={() => {
        zoomIn(props.app.strictDrawing.drawing);
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
        src={plus}
        alt='Plus'
        style={{
          width: '10px',
        }}
      />
    </div>
  );
}
