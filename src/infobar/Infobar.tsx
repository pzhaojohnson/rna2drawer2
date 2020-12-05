import * as React from 'react';
import { AppInterface as App } from '../AppInterface';
import { ZoomAdjust } from './zoom/ZoomAdjust';

interface Props {
  app: App;
}

/**
 * Returns null when drawing is empty.
 */
export function Infobar(props: Props): React.ReactElement | null {
  if (props.app.strictDrawing.isEmpty()) {
    return null;
  } else {
    return (
      <div
        style={{
          height: '26px',
          borderWidth: '1px 0px 0px 0px',
          borderStyle: 'solid',
          borderColor: 'rgba(0,0,0,0.25)',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <div style={{ flexGrow: 1 }} ></div>
        <ZoomAdjust app={props.app} />
      </div>
    );
  }
}
