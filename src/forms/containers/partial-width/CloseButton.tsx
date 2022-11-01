import * as React from 'react';
import styles from './CloseButton.css';

function CrossMark() {
  let props = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '11px',
    height: '11px',
    viewBox: '0 0 11 11',
  };

  let path = (
    <path
      className={styles.crossMark}
      d='M 0.5 0.5 L 10.5 10.5 M 10.5 0.5 L 0.5 10.5'
      strokeWidth='1'
      strokeLinecap='round'
    />
  );

  return (
    <svg {...props} >
      {path}
    </svg>
  );
}

export type Props = {
  onClick: () => void;
};

export class CloseButton extends React.Component<Props> {
  render() {
    return (
      <div
        className={styles.closeButton}
        title='Close form.'
        onClick={this.props.onClick}
      >
        <CrossMark />
      </div>
    );
  }
}
