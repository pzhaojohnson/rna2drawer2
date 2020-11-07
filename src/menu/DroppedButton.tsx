import * as React from 'react';
import CheckMark from './CheckMark';

interface Props {
  text?: string;
  onClick?: () => void;
  keyBinding?: string;
  checked?: boolean;
  borderStyle?: string;
  borderColor?: string;
  borderWidth?: string;
  disabled?: boolean;
}

export function DroppedButton(props: Props): React.ReactElement {
  return (
    <button
      className={'dropped-menu-button'}
      onClick={props.disabled ? undefined : props.onClick}
      style={{
        textAlign: 'left',
        // override background color on hover defined in CSS file when disabled
        backgroundColor: props.disabled ? '#ffffff' : undefined,
        color: props.disabled ? '#808080' : '#000000',
        borderStyle: props.borderStyle,
        borderColor: props.borderColor,
        borderWidth: props.borderWidth,
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
