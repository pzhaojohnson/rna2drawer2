import * as React from 'react';
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
        style={{ margin: this.props.margin }}
      >
        {this.props.message ? this.p() : null}
      </div>
    );
  }

  p() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          margin: this.props.margin,
          fontSize: this.props.fontSize,
          color: 'red',
          animationName: 'fadein',
          animationDuration: '0.75s',
        }}
      >
        {this.props.message}
      </p>
    );
  }
}

ErrorMessage.defaultProps = {
  message: '',
  margin: '0px',
  fontSize: '14px',
};

export default ErrorMessage;
