import * as React from 'react';

class TopButton extends React.Component {
  static defaultProps: {
    backgroundColor: string;
    disabled: boolean;
    buttonColor: string;
    disabledButtonColor: string;
  };

  props!: {
    backgroundColor: string;
    text: string;
    disabled: boolean;
    buttonColor: string;
    disabledButtonColor: string;
  };

  render() {
    return (
      <button
        style={{
          border: 'none',
          margin: '0px',
          padding: '6px 8px 6px 8px',
          fontSize: '12px',
          backgroundColor: this.props.backgroundColor,
          color: this.props.disabled ? this.props.disabledButtonColor : this.props.buttonColor,
        }}
      >
        {this.props.text}
      </button>
    );
  }
}

TopButton.defaultProps = {
  backgroundColor: '#ffffff',
  disabled: false,
  buttonColor: 'rgba(0,0,0,0.8)',
  disabledButtonColor: 'rgba(0,0,0,0.4)',
};

export default TopButton;
