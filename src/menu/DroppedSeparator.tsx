import * as React from 'react';

class DroppedSeparator extends React.Component {
  static defaultProps: {
    backgroundColor: string;
    borderColor: string;
  };

  props!: {
    backgroundColor: string;
    borderColor: string;
  };

  render() {
    return (
      <div
        style={{
          width: '100%',
          backgroundColor: this.props.backgroundColor,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            height: '0px',
            borderWidth: '0px 0px thin 0px',
            borderStyle: 'solid',
            borderColor: this.props.borderColor,
            margin: '0px 4px 0px 4px',
          }}
        ></div>
      </div>
    );
  }
}

DroppedSeparator.defaultProps = {
  backgroundColor: '#ffffff',
  borderColor: '#bfbfbf',
};

export default DroppedSeparator;
