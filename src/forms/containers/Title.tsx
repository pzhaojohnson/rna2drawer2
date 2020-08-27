import * as React from 'react';

interface Props {
  text: string;
  margin?: string;
  fontSize?: string;
}

export class Title extends React.Component {
  static defaultProps: Props;

  props!: Props;

  render(): React.ReactElement {
    return (
      <p
        className={'unselectable-text'}
        style={{
          margin: this.props.margin,
          fontSize: this.props.fontSize,
        }}
      >
        {this.props.text}
      </p>
    );
  }
}

Title.defaultProps = {
  text: '',
  margin: '16px 32px 0px 32px',
  fontSize: '24px',
};

export default Title;
