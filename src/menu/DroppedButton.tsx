import * as React from 'react';
import CheckMark from './CheckMark';

class DroppedButton extends React.Component {
  static defaultProps: {
    keyBinding: string;
    disabled: boolean;
    backgroundColor: string;
    checked: boolean;
    buttonColor: string;
    disabledButtonColor: string;
  }

  props!: {
    text: string;
    onClick: () => void;
    keyBinding: string;
    disabled: boolean;
    backgroundColor: string;
    checked: boolean;
    buttonColor: string;
    disabledButtonColor: string;
  }

  render() {
    return (
      <button
        className={'dropped-menu-button'}
        onClick={this.props.disabled ? () => {} : this.props.onClick}
        style={{
          minWidth: '200px',
          border: 'none',
          margin: '0px',
          padding: '6px 8px 6px 8px',
          backgroundColor: this.props.disabled ? this.props.backgroundColor : undefined,
          textAlign: 'left',
          fontSize: '12px',
          color: this.props.disabled ? this.props.disabledButtonColor : this.props.buttonColor,
        }}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }} >
          <div style={{ flexGrow: 1 }} >
            {this.props.text}
          </div>
          <div>
            {this.props.keyBinding ? this.props.keyBinding : null}
          </div>
          {this.props.checked ? <CheckMark /> : null}
        </div>
      </button>
    );
  }
}

DroppedButton.defaultProps = {
  disabled: false,
  keyBinding: '',
  backgroundColor: '#ffffff',
  checked: false,
  buttonColor: '#000000',
  disabledButtonColor: '#808080',
};

export default DroppedButton;
