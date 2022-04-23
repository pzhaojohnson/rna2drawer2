import * as React from 'react';
import styles from './CheckboxField.css';

export type Props = {
  label?: string;

  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  style?: React.CSSProperties;
};

export function CheckboxField(props: Props) {
  return (
    <label
      className={styles.label}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...props.style,
      }}
    >
      <input
        type='checkbox'
        checked={props.checked}
        onChange={props.onChange}
        style={{ marginRight: '6px' }}
      />
      {props.label}
    </label>
  );
}
