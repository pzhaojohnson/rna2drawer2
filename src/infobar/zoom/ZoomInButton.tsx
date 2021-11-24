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

export type Props = {
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
    >
      <img
        className={`${styles.plus} unselectable`}
        src={plus}
        alt='Plus'
      />
    </div>
  );
}
