import * as React from 'react';
import styles from './DetailsToggle.css';

export type Props = {
  onClick?: () => void;

  style?: React.CSSProperties;
};

export function DetailsToggle(props: Props) {
  return (
    <button
      className={styles.detailsToggle}
      onClick={props.onClick}
      style={props.style}
    >
      Details
    </button>
  );
}
