import * as React from 'react';
import styles from './FieldDescription.css';

export type Props = {

  // the contents of the field description
  children?: React.ReactNode;

  style?: React.CSSProperties;
};

/**
 * A paragraph element whose contents describe a field in a form.
 *
 * (This component is meant to help standardize the CSS styles
 * of field descriptions.)
 */
export function FieldDescription(props: Props) {
  return (
    <p className={styles.fieldDescription} style={props.style} >
      {props.children}
    </p>
  );
}
