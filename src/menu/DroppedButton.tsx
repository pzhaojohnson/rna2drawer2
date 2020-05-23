import * as React from 'react';
const uuidv1 = require('uuid/v1');
import CheckMark from './CheckMark';

class DroppedButton extends React.Component {
  static defaultProps: {
    backgroundColor: string;
    disabled: boolean;
    keyBinding: string;
    checked: boolean;
    buttonColor: string;
    disabledButtonColor: string;
  }

  props: {
    backgroundColor: string;
    text: string;
    onClick: () => void;
    disabled: boolean;
    keyBinding: string;
    checked: boolean;
    buttonColor: string;
    disabledButtonColor: string;
  }

  render() {
    return (
      <button
        key={uuidv1()}
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
          <div style={{ flexGrow: '1' }} >
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
  backgroundColor: '#ffffff',
  disabled: false,
  keyBinding: '',
  checked: false,
  buttonColor: '#000000',
  disabledButtonColor: '#808080',
};

export default DroppedButton;
