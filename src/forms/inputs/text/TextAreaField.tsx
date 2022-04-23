import * as React from 'react';
import styles from './TextAreaField.css';

export type Props = {
  label?: string;

  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;

  textArea?: {
    rows?: number;
  };

  style?: React.CSSProperties;
};

/**
 * A labeled textarea element.
 */
export function TextAreaField(props: Props) {
  return (
    <label
      className={styles.label}
      style={props.style}
    >
      {props.label}
      <textarea
        className={styles.textArea}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        rows={props.textArea?.rows ?? 10}
      />
    </label>
  );
}
