import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import { ZoomOutButton } from './ZoomOutButton';
import { ZoomInButton } from './ZoomInButton';

interface Props {
  app: App;
}

export function ZoomAdjust(props: Props): React.ReactElement {
  return (
    <div
      style={{
        margin: '0px 6px 0px 8px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <ZoomOutButton app={props.app} />
      <p
        className={'unselectable-text'}
        style={{
          padding: '0px 4px 0px 4px',
          fontSize: '12px',
        }}
      >
        {(100 * props.app.strictDrawing.zoom).toFixed(0) + '%'}
      </p>
      <ZoomInButton app={props.app} />
    </div>
  );
}
