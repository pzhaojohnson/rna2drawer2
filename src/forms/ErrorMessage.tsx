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
    if (!this.props.message) {
      return <div key={id} id={id} style={{ margin: this.props.margin }} ></div>;
    } else {
      return (
        <div key={id} id={id} style={{ margin: this.props.margin }} >
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
        </div>
      );
    }
  }
}

ErrorMessage.defaultProps = {
  message: '',
  margin: '0px',
  fontSize: '14px',
};

export default ErrorMessage;
