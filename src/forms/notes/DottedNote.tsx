import * as React from 'react';
import styles from './DottedNote.css';

export type Props = {

  // the contents of the note
  children?: React.ReactNode;

  style?: React.CSSProperties;
};

/**
 * This component adds a dot to the left of the contents
 * of the note and includes CSS styling.
 *
 * The contents of the note are specified as children
 * of this component.
 */
export function DottedNote(props: Props) {
  return (
    <div className={styles.dottedNote} style={props.style} >
      <div className={styles.dot} />
      <div className={styles.spacer} />
      {props.children}
    </div>
  );
}
