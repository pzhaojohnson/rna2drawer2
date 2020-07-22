import * as React from 'react';

class Dropdown extends React.Component {
  static defaultProps: {
    borderColor: string;
  }

  props!: {
    borderColor: string;
    topButton: React.ReactElement;
    droppedElements: Array<React.ReactElement>;
  }

  render() {
    return (
      <div className={'dropdown-menu'} >
        {this.props.topButton}
        <div
          className={'dropdown-menu-content'}
          style={{
            borderWidth: '0px 1px 1px 1px',
            borderStyle: 'solid',
            borderColor: this.props.borderColor,
          }}
        >
          {this.props.droppedElements}
        </div>
      </div>
    );
  }
}

Dropdown.defaultProps = {
  borderColor: 'rgba(0,0,0,0.2)',
};

export default Dropdown;
