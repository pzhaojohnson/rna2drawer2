import * as React from 'react';
import { useState } from 'react';
import { AppInterface as App } from 'AppInterface';
import minus from '../../icons/minus.svg';
import { zoomOut } from './control';

export interface Props {
  app: App;
}

export function ZoomOutButton(props: Props) {
  let [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      onClick={() => {
        zoomOut(props.app.strictDrawing.drawing);
        props.app.drawingChangedNotByInteraction();
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
        src={minus}
        alt='Minus'
        style={{
          width: '8px',
        }}
      />
    </div>
  );
}
