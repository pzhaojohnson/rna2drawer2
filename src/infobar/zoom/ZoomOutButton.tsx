import * as React from 'react';
import styles from './ZoomOutButton.css';
import minus from './minus.svg';
import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { zoom, setZoom } from 'Draw/zoom';
import { nextLowestPresetZoom } from './presetZooms';

function zoomOut(drawing: Drawing) {
  let z = zoom(drawing);

  if (typeof z != 'number') {
    // reset zoom if somehow became undefined
    setZoom(drawing, 1);
    return;
  }

  let nextLowest = nextLowestPresetZoom(z);

  if (typeof nextLowest == 'number') {
    setZoom(drawing, nextLowest);
  }
}

export type Props = {
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
    >
      <img
        className={`${styles.minus} unselectable`}
        src={minus}
        alt='Minus'
      />
    </div>
  );
}
