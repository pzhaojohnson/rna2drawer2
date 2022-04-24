import * as React from 'react';
import styles from './FieldLabel.css';

export type Props = {
  htmlFor?: string;

  children?: React.ReactNode;

  style?: React.CSSProperties;
};

/**
 * A label element for form fields.
 *
 * (Meant to help standardize the CSS styles of field labels in forms.)
 */
export function FieldLabel(props: Props) {
  return (
    <label
      className={styles.fieldLabel}
      htmlFor={props.htmlFor}
      style={props.style}
    >
      {props.children}
    </label>
  );
}
