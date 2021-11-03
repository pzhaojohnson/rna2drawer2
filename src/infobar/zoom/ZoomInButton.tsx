import * as React from 'react';
import { useState } from 'react';
import { AppInterface as App } from 'AppInterface';
import plus from './plus.svg';
import { zoomIn } from './control';

export interface Props {
  app: App;
}

export function ZoomInButton(props: Props) {
  let [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      onClick={() => {
        zoomIn(props.app.strictDrawing.drawing);
        props.app.refresh();
      }}
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '2px',
        backgroundColor: hovered ? 'gainsboro' : 'transparent',
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
