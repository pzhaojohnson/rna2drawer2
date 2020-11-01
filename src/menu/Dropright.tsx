import * as React from 'react';
import { RightCaret } from './RightCaret';

export const trailingButtonBorderStyles = {
  borderStyle: 'solid',
  borderColor: 'rgba(0,0,0,0.3)',
  borderWidth: '0px 0px 0px 1px',
}

interface Props {
  name?: string;
  dropped?: React.ReactElement;
}

export function Dropright(props: Props): React.ReactElement {
  return (
    <div className={'dropright-menu'} >
      <button
        style={{
          minWidth: '200px',
          backgroundColor: 'white',
          color: 'black',
          textAlign: 'left',
          margin: '0px',
          padding: '6px 8px 6px 8px',
        }}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
          <div style={{ flexGrow: 1 }} >
            {props.name}
          </div>
          <RightCaret height={'16px'} padding={'0px 0px 0px 2px'} />
        </div>
      </button>
      <div
        className={'dropright-menu-dropped'}
        style={{
          borderStyle: 'solid',
          borderColor: 'rgba(0,0,0,0.3) rgba(0,0,0,0.3) rgba(0,0,0,0.3) white',
          borderWidth: '1px 1px 1px 0px',
        }}
      >
        {props.dropped}
      </div>
    </div>
  );
}
