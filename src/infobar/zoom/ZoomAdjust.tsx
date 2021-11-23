import * as React from 'react';
import { AppInterface as App } from 'AppInterface';
import { ZoomDisplay } from './ZoomDisplay';
import { ZoomInButton } from './ZoomInButton';
import { ZoomOutButton } from './ZoomOutButton';

export interface Props {
  app: App;
}

export function ZoomAdjust(props: Props) {
  return (
    <div
      style={{
        margin: '0px 6px 0px 8px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <ZoomOutButton {...props} />
      <ZoomDisplay {...props} />
      <ZoomInButton {...props} />
    </div>
  );
}
