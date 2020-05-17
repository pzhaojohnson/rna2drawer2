import React from 'react';
import PropTypes from 'prop-types';

import plus from '../icons/plus.svg';
import minus from '../icons/minus.svg';

const _ZOOMS = [0.05, 0.1, 0.25, 0.35, 0.5, 0.6, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 7.5, 10];

class Infobar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      zoomMinusHovered: false,
      zoomPlusHovered: false,
    };
  }

  render() {
    if (this.props.drawingIsEmpty) {
      return <div></div>;
    }
    return (
      <div
        style={{
          height: '26px',
          borderWidth: 'thin 0px 0px 0px',
          borderStyle: 'solid',
          borderColor: '#bfbfbf',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {this.leftPlaceholder()}
        {this.zoomSection()}
      </div>
    );
  }

  leftPlaceholder() {
    return (
      <div
        style={{
          flexGrow: '1',
        }}
      ></div>
    );
  }

  zoomSection() {
    return (
      <div
        style={{
          margin: '0px 6px 0px 8px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {this.zoomMinus()}
        {this.zoomDisplay()}
        {this.zoomPlus()}
      </div>
    );
  }

  zoomMinus() {
    return (
      <div
        onMouseOver={() => this.onZoomMinusOver()}
        onMouseOut={() => this.onZoomMinusOut()}
        onClick={() => this.decreaseZoom()}
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '2px',
          backgroundColor: this.state.zoomMinusHovered ? 'gainsboro' : 'transparent',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          className={'unselectable'}
          src={minus}
          alt={'Minus'}
          style={{
            width: '8px',
          }}
        />
      </div>
    );
  }

  onZoomMinusOver() {
    this.setState({
      zoomMinusHovered: true,
    });
  }

  onZoomMinusOut() {
    this.setState({
      zoomMinusHovered: false,
    });
  }

  nextLowestPredefinedZoom() {
    let curr = this.props.zoom;
    let nextLowest = _ZOOMS[0];
    _ZOOMS.slice(1).forEach(z => {
      if (z < curr && Math.abs(z - curr) > 0.01) {
        nextLowest = z;
      }
    });
    return nextLowest;
  }

  decreaseZoom() {
    if (!this.props.setZoom) {
      console.error('Missing setZoom callback.');
      return;
    }
    this.props.setZoom(
      this.nextLowestPredefinedZoom()
    );
  }

  zoomDisplay() {
    let z = 100 * this.props.zoom;
    z = z.toFixed(0);
    z += '%';
    return (
      <p
        className={'unselectable-text'}
        style={{
          padding: '0px 4px 0px 4px',
          fontSize: '12px',
        }}
      >
        {z}
      </p>
    );
  }

  zoomPlus() {
    return (
      <div
        onMouseOver={() => this.onZoomPlusOver()}
        onMouseOut={() => this.onZoomPlusOut()}
        onClick={() => this.increaseZoom()}
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '2px',
          backgroundColor: this.state.zoomPlusHovered ? 'gainsboro' : 'transparent',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          className={'unselectable'}
          src={plus}
          alt={'Plus'}
          style={{
            width: '10px',
          }}
        />
      </div>
    );
  }

  onZoomPlusOver() {
    this.setState({
      zoomPlusHovered: true,
    });
  }

  onZoomPlusOut() {
    this.setState({
      zoomPlusHovered: false,
    });
  }

  nextHighestPredefinedZoom() {
    let curr = this.props.zoom;
    let nextHighest = _ZOOMS[_ZOOMS.length - 1];
    for (let i = _ZOOMS.length - 2; i >= 0; i--) {
      let z = _ZOOMS[i];
      if (z > curr && Math.abs(z - curr) > 0.01) {
        nextHighest = z;
      }
    }
    return nextHighest;
  }

  increaseZoom() {
    if (!this.props.setZoom) {
      console.error('Missing setZoom callback.');
      return;
    }
    this.props.setZoom(
      this.nextHighestPredefinedZoom()
    );
  }
}

Infobar.propTypes = {
  drawingIsEmpty: PropTypes.bool,
  zoom: PropTypes.number,
  setZoom: PropTypes.func,
};

Infobar.defaultProps = {
  drawingIsEmpty: true,
  zoom: 1,
  setZoom: z => {},
};

export default Infobar;

export {
  Infobar,

  // only exported to aid testing
  _ZOOMS,
}
