import * as React from 'react';
import TopButton from './TopButton';

class Dropdown extends React.Component {
  static defaultProps: {
    borderColor: string;
  }

  props!: {
    borderColor: string;
    name: string;
    dropped: React.ReactElement;
    disabled?: boolean;
  }

  render() {
    return (
      <div className={'dropdown-menu'} >
        <TopButton
          text={this.props.name}
          disabled={this.props.disabled}
        />
        {this.props.disabled ? null : (
          <div
            className={'dropdown-menu-content'}
            style={{
              borderWidth: '0px 1px 1px 1px',
              borderStyle: 'solid',
              borderColor: this.props.borderColor,
            }}
          >
            {this.props.dropped}
          </div>
        )}
      </div>
    );
  }
}

Dropdown.defaultProps = {
  borderColor: 'rgba(0,0,0,0.2)',
};

export default Dropdown;
