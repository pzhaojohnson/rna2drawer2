import * as React from 'react';
import styles from './ToolOptionToggle.css';

function Check() {
  return (
    <svg
      className={styles.check}
      width="10.5px" height="10.5px"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96" overflow="hidden"
    >
      <path
        d="M86.1 15.8 34.9 64.2 10.3 39 1.8 47.1 34.5 80.7 43.1 72.7 94.2 24.2Z"
        stroke="#121213" strokeWidth="3.5"
        fill="#121213"
      />
    </svg>
  );
}

export type Props = {
  isToggled?: boolean;

  onClick?: () => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

  children?: React.ReactNode;

  style?: React.CSSProperties;
};

export function ToolOptionToggle(props: Props) {
  return (
    <button
      className={`
        ${styles.toolOptionToggle}
        ${props.isToggled ? styles.toggled : styles.untoggled}
      `}
      onClick={props.onClick}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      style={props.style}
    >
      {props.children}
      <Check />
    </button>
  );
}
