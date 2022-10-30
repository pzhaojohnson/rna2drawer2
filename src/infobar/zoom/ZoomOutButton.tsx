import * as React from 'react';
import styles from './ZoomOutButton.css';
import type { App } from 'App';
import type { Drawing } from 'Draw/Drawing';
import { zoom, setZoom } from 'Draw/zoom';
import { round } from 'Math/round';
import { nextLowestPresetZoom } from './presetZooms';

function zoomOut(drawing: Drawing) {
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

  let nextLowest = nextLowestPresetZoom(z);

  if (typeof nextLowest == 'number') {
    setZoom(drawing, nextLowest);
  }
}

function MinusIcon() {
  return (
    <svg
      width="10px" height="10px" viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg" overflow="hidden"
    >
      <rect
        x="0" y="4" width="10" height="2" rx="1"
        fill="#1a1a1c"
      />
    </svg>
  );
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
      <MinusIcon />
    </div>
  );
}
