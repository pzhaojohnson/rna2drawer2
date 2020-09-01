import * as React from 'react';
import TopButton from './TopButton';

interface Props {
  name: string;
  dropped: React.ReactElement;
  disabled?: boolean;
}

export function Dropdown(props: Props): React.ReactElement {
  return (
    <div className={'dropdown-menu'} >
      <TopButton
        text={props.name}
        disabled={props.disabled}
      />
      {props.disabled ? null : (
        <div
          className={'dropdown-menu-content'}
          style={{
            borderWidth: '0px 1px 1px 1px',
            borderStyle: 'solid',
            borderColor: 'rgba(0,0,0,0.2)',
          }}
        >
          {props.dropped}
        </div>
      )}
    </div>
  );
}
