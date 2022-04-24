import * as React from 'react';
import styles from './TextInput.css';

export type Props = {
  value?: string;

  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  style?: React.CSSProperties;
};

/**
 * A text input element.
 *
 * (Meant to help standardize the CSS styles of text input elements
 * in forms.)
 */
export function TextInput(props: Props) {
  return (
    <input
      type='text'
      className={styles.textInput}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      onKeyUp={props.onKeyUp}
      style={props.style}
    />
  );
}
