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
          borderWidth: '0px 0px 1px 0px',
          borderStyle: 'solid',
          borderColor: 'rgba(0,0,0,0.15)',
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
