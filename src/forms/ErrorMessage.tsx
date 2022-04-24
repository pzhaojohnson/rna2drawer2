import * as React from 'react';
import styles from './ErrorMessage.css';

interface Props {
  message?: string;
}

export class ErrorMessage extends React.Component<Props> {
  render() {
    return (
      <p
        className={`
          ${styles.errorMessage}
          ${styles.blinksIn}
          unselectable
        `}
      >
        {this.props.message}
      </p>
    );
  }
}

export default ErrorMessage;
