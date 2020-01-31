import React from 'react';
import PropTypes from 'prop-types';

class OpenFASTA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  render() {
    return (
      <div
        style={{
          width: this.props.width,
          height: this.props.height,
          backgroundColor: '#fcfcfc',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {this._titleSection()}
        {this._fileInput()}
      </div>
    );
  }

  _titleSection() {
    return (
      <div style={{ marginTop: '12px' }} >
        {this._title()}
        {this._titleUnderline()}
      </div>
    );
  }

  _title() {
    return (
      <p className={'unselectable-text'} style={{ margin: '0px 24px 0px 24px', fontSize: '24px' }} >
        Open a Sequence
      </p>
    );
  }

  _titleUnderline() {
    return (
      <div
        style={{
          height: '0px',
          borderWidth: '0px 0px thin 0px',
          borderStyle: 'solid',
          borderColor: '#bfbfbf',
          margin: '8px 16px 0px 16px',
        }}
      ></div>
    );
  }

  _fileInput() {
    return (
      <input type={'file'} style={{ margin: '28px 28px 0px 28px' }} />
    );
  }

  
}

OpenFASTA.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  closeCallback: PropTypes.func,
};

OpenFASTA.defaultProps = {
  width: '100vw',
  height: '100%',
};

export default OpenFASTA;
