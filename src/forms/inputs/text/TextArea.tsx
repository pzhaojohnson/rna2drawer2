import * as React from 'react';
import styles from './TextArea.css';

export type Props = {
  value?: string;

  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;

  rows?: number;

  style?: React.CSSProperties;
};

/**
 * A textarea element.
 *
 * (Meant to help standardize the CSS styles of textarea elements
 * in forms.)
 */
export function TextArea(props: Props) {
  return (
    <textarea
      className={styles.textArea}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      rows={props.rows}
      style={props.style}
    />
  );
}
