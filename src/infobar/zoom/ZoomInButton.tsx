import * as React from 'react';
import styles from './ZoomInButton.css';
import plus from './plus.svg';
import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { zoom, setZoom } from 'Draw/zoom';
import { round } from 'Math/round';
import { nextHighestPresetZoom } from './presetZooms';

function zoomIn(drawing: Drawing) {
  let z = zoom(drawing);

  if (typeof z != 'number') {
    // reset zoom if somehow became undefined
    setZoom(drawing, 1);
    return;
  }

  // account for floating point imprecision in calculating zoom
  // (otherwise might get stuck on some preset zooms)
  // (and most likely no preset zoom has more than 6 decimal places)
  z = round(z, 6);

  let nextHighest = nextHighestPresetZoom(z);

  if (typeof nextHighest == 'number') {
    setZoom(drawing, nextHighest);
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
