import * as React from 'react';
import { AppInterface as App } from 'AppInterface';
import { zoom } from 'Draw/zoom';
import { round } from 'Math/round';

export interface Props {
  app: App;
}

export function ZoomDisplay(props: Props) {
  let z = zoom(props.app.strictDrawing.drawing) ?? 0;
  let percentage = round(100 * z, 0) + '%';
  return (
    <p
      className={'unselectable-text'}
      style={{
        padding: '0px 4px 0px 4px',
        fontSize: '12px',
      }}
    >
      {percentage}
    </p>
  );
}
