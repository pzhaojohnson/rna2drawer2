import * as React from 'react';
import styles from './ZoomInButton.css';
import type { App } from 'App';
import type { Drawing } from 'Draw/Drawing';
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

function PlusIcon() {
  return (
    <svg
      width="9px" height="9px" viewBox="0 0 9 9"
      xmlns="http://www.w3.org/2000/svg" overflow="hidden"
    >
      <path
        d="M 0 4.5 L 9 4.5 M 4.5 0 L 4.5 9"
        strokeWidth="1.5" stroke="#1a1a1c"
      />
    </svg>
  );
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
      <PlusIcon />
    </div>
  );
}
