import * as React from 'react';
import styles from './OptionsToggle.css';

type Props = {
  onClick: () => void;
};

export function OptionsToggle(props: Props) {
  return (
    <button
      className={styles.optionsToggle}
      onClick={props.onClick}
    >
      Options
    </button>
  );
}
