import * as React from 'react';
import CheckMark from './CheckMark';

interface Props {
  text?: string;
  onClick?: () => void;
  keyBinding?: string;
  checked?: boolean;
  disabled?: boolean;
}

export function DroppedButton(props: Props): React.ReactElement {
  return (
    <button
      className={'dropped-menu-button'}
      onClick={props.disabled ? undefined : props.onClick}
      style={{
        minWidth: '200px',
        border: 'none',
        margin: '0px',
        padding: '6px 8px 6px 8px',
        textAlign: 'left',
        fontSize: '12px',
        color: props.disabled ? '#808080' : '#000000',
      }}
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }} >
        <div style={{ flexGrow: 1 }} >
          {props.text}
        </div>
        <div>
          {props.keyBinding}
        </div>
        {props.checked ? <CheckMark /> : null}
      </div>
    </button>
  );
}

export default DroppedButton;
