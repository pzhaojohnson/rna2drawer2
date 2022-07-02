import * as React from 'react';
import styles from './OptionsToggle.css';

export type Props = {
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

/**
 * This component is meant to help standardize the appearance
 * of toggles for showing and hiding additional options in forms.
 */
export function OptionsToggle(props: Props) {
  return (
    <button
      className={styles.optionsToggle}
      onClick={props.onClick}
      style={props.style}
    >
      {props.children}
    </button>
  );
}
