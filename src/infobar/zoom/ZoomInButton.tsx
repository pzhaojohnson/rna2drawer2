import * as React from 'react';
import { useState } from 'react';
import { AppInterface as App } from '../../AppInterface';
import plus from '../../icons/plus.svg';
import { nextHighestPresetZoom } from './zoomPresets';

interface Props {
  app: App;
}

export function ZoomInButton(props: Props): React.ReactElement {
  let [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      onClick={() => {
        let nextHighest = nextHighestPresetZoom(props.app.strictDrawing.zoom);
        props.app.strictDrawing.zoom = nextHighest;
        props.app.renderPeripherals();
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
        alt={'Plus'}
        style={{
          width: '10px',
        }}
      />
    </div>
  );
}
