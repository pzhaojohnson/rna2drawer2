import React from 'react';
import PropTypes from 'prop-types';
import blackCrossMark from './blackCrossMark.svg';
import whiteCrossMark from './whiteCrossMark.svg';

class CloseButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hovered: false,
    };
  }

  _cross() {
    let src = this.state.hovered ? whiteCrossMark : blackCrossMark;
    return (
      <img
        className={'unselectable'}
        src={src}
        alt={'Cross'}
        style={{ height: '18px' }}
      />
    );
  }

  render() {
    return (
      <div
        onMouseEnter={() => this.onMouseEnter()}
        onMouseLeave={() => this.onMouseLeave()}
        onClick={() => this.onClick()}
        style={{
          position: this.props.position,
          top: this.props.top,
          right: this.props.right,
          width: '27px',
          height: '27px',
          backgroundColor: this.state.hovered ? '#ff0000' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {this._cross()}
      </div>
    );
  }
  
  onMouseEnter() {
    this.setState({ hovered: true });
  }

  onMouseLeave() {
    this.setState({ hovered: false });
  }

  onClick() {
    this.props.onClick();
  }
}

CloseButton.propTypes = {
  position: PropTypes.string,
  top: PropTypes.string,
  right: PropTypes.string,
  close: PropTypes.func,
};

CloseButton.defaultProps = {
  width: '20px',
  height: '20px',
  onClick: () => {},
};

export {
  CloseButton,
};
