import * as React from 'react';

interface Props {
  margin?: string;
}

export class Underline extends React.Component {
  static defaultProps: Props;

  props!: Props;

  render(): React.ReactElement {
    return (
      <div
        style={{
          height: '0px',
          borderWidth: '0px 0px thin 0px',
          borderStyle: 'solid',
          borderColor: '#bfbfbf',
          margin: this.props.margin,
        }}
      ></div>
    );
  }
}

Underline.defaultProps = {
  margin: '8px 16px 0px 16px',
};

export default Underline;
