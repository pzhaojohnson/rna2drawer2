import * as React from 'react';
import Logo from './Logo';

class Menu extends React.Component {
  static defaultProps: {
    borderColor: string;
    backgroundColor: string;
  }

  props!: {
    borderColor: string;
    backgroundColor: string;
    
    fileDropdown: React.ReactElement;
    modeDropdown: React.ReactElement;
    editDropdown: React.ReactElement;
    exportDropdown: React.ReactElement;
  }

  render() {
    return (
      <div
        style={{
          borderWidth: '0px 0px thin 0px',
          borderStyle: 'solid',
          borderColor: this.props.borderColor,
          backgroundColor: this.props.backgroundColor,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Logo />
        {this.props.fileDropdown}
        {this.props.modeDropdown}
        {this.props.editDropdown}
        {this.props.exportDropdown}
      </div>
    );
  }
}

Menu.defaultProps = {
  borderColor: '#bfbfbf',
  backgroundColor: '#ffffff',
};

export default Menu;
