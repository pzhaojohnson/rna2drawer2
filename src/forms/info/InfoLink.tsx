import * as React from 'react';
import styles from './InfoLink.css';

export type Props = {
  href?: string;
  title?: string;
  style?: React.CSSProperties;
};

/**
 * An anchor element whose text is a question mark.
 *
 * Intended to be placed next to form inputs and labels so that users
 * may learn more about things such as various SVG attributes.
 */
export function InfoLink(props: Props) {
  return (
    <a
      className={styles.infoLink}
      href={props.href}
      title={props.title}
      style={props.style}
    >
      ?
    </a>
  );
}
