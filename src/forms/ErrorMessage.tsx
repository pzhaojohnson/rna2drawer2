import * as React from 'react';
import styles from './ErrorMessage.css';

interface Props {
  message?: string;
}

export class ErrorMessage extends React.Component<Props> {
  render() {
    return (
      <div
        className={styles.blinksIn}
      >
        {this.props.message ? this.p() : null}
      </div>
    );
  }

  p() {
    return (
      <p
        className={`${styles.errorMessage} unselectable`}
      >
        <span>
          {this.props.message}
        </span>
      </p>
    );
  }
}

export default ErrorMessage;
