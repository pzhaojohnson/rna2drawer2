import * as React from 'react';
import styles from './TextArea.css';

export type Props = {
  id?: string;

  value?: string;

  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;

  rows?: number;
  placeholder?: string;
  spellCheck?: boolean | 'true' | 'false';
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
      id={props.id}
      className={styles.textArea}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      rows={props.rows}
      placeholder={props.placeholder}
      spellCheck={props.spellCheck}
      style={props.style}
    />
  );
}
