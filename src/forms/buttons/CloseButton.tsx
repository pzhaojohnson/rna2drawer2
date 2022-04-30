import * as React from 'react';
import styles from './CloseButton.css';

function CrossMark() {
  return (
    <svg
      width="16px" height="16px" viewBox="0 0 96 96" overflow="hidden"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="clip0" >
          <rect x="592" y="312" width="96" height="96" />
        </clipPath>
      </defs>
      <g clipPath="url(#clip0)" transform="translate(-592 -312)" >
        <path
          className={styles.crossMark}
          d="M608.707 391.707 639 361.414 670.293 392.707 671.707 391.293 640.414 360 671.707 328.707 670.293 327.293 639 358.586 608.707 328.293 607.293 329.707 637.586 360 607.293 390.293 608.707 391.707Z"
          strokeWidth="0.333333"
        />
      </g>
    </svg>
  );
}

interface Props {
  onClick: () => void;
}

export class CloseButton extends React.Component<Props> {
  render() {
    return (
      <div
        className={styles.closeButton}
        onClick={this.props.onClick}
      >
        <CrossMark />
      </div>
    );
  }
}
