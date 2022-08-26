import * as React from 'react';
import styles from './RemoveButton.css';

function MinusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" version="1.1"
      width="10px" height="10px"
    >
      <path d="M 1 5 H 9" stroke="#904b4b" strokeWidth="2" />
    </svg>
  );
}

export type Props = {
  onClick?: () => void;

  style?: React.CSSProperties;
};

export class RemoveButton extends React.Component<Props> {
  render() {
    return (
      <div
        className={styles.removeButton}
        onClick={this.props.onClick}
        style={this.props.style}
      >
        <MinusIcon />
        <p className={styles.removeButtonText} >
          Remove
        </p>
      </div>
    );
  }
}
