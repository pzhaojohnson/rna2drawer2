import * as React from 'react';

class Dropdown extends React.Component {
  static defaultProps: {
    borderColor: string;
  }

  props: {
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
            borderWidth: '0px thin thin thin',
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
  borderColor: '#bfbfbf',
};

export default Dropdown;
