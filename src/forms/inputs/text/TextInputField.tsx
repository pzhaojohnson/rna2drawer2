import * as React from 'react';
import styles from './TextInputField.css';

export type Props = {
  label?: string;

  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  // for specifying attributes of the text input element of the field
  textInput?: {
    style?: React.CSSProperties;
  };

  style?: React.CSSProperties;
};

/**
 * A labeled text input element.
 */
export function TextInputField(props: Props) {
  return (
    <label
      className={styles.label}
      style={props.style}
    >
      <input
        type='text'
        className={styles.textInput}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        onKeyUp={props.onKeyUp}
        style={props.textInput?.style}
      />
      {props.label}
    </label>
  );
}
