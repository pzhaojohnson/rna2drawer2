import * as React from 'react';
import styles from './ErrorMessage.css';
const uuidv1 = require('uuid/v1');

interface Props {
  message: string;
  margin?: string;
  fontSize?: string;
}

export class ErrorMessage extends React.Component {
  static defaultProps: Props;

  props!: Props;

  render() {
    let id = uuidv1();
    return (
      <div
        key={id}
        id={id}
        className={styles.fadesIn}
        style={{ margin: this.props.margin }}
      >
        {this.props.message ? this.p() : null}
      </div>
    );
  }

  p() {
    return (
      <p
        className={`${styles.errorMessage} unselectable`}
        style={{
          fontSize: this.props.fontSize,
        }}
      >
        <span>
          {this.props.message}
        </span>
      </p>
    );
  }
}

ErrorMessage.defaultProps = {
  message: '',
  margin: '0px',
};

export default ErrorMessage;
