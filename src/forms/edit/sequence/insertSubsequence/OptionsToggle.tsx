import * as React from 'react';
import styles from './OptionsToggle.css';

export type Props = {
  onClick?: () => void;
  style?: React.CSSProperties;
};

export function OptionsToggle(props: Props) {
  return (
    <button
      className={styles.optionsToggle}
      onClick={props.onClick}
      style={props.style}
    >
      Options
    </button>
  );
}
