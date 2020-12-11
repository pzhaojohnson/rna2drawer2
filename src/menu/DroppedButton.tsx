import * as React from 'react';
import styles from './DroppedButton.css';
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
      className={`${styles.droppedButton} ${props.disabled ? '' : styles.enabled}`}
      onClick={props.disabled ? undefined : props.onClick}
      style={{
        textAlign: 'left',
        color: props.disabled ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.8)',
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
