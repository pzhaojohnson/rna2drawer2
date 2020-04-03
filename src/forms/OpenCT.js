import React from 'react';
import PropTypes from 'prop-types';

class OpenCT extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sequenceId: '',
      
      fileName: '',
      fileContent: '',

      errorMessage: '',
    };
  }

  render() {
    return (
      <div
        style={{
          width: this.props.width,
          height: '100%',
          backgroundColor: '#fcfcfc',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            flexGrow: '1',
            maxHeight: '800px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              flexGrow: '1',
              maxWidth: '1200px',
              margin: '16px',
              border: 'thin solid #bfbfbf',
              borderRadius: '32px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {this._titleAndContent()}
          </div>
        </div>
      </div>
    );
  }

  _titleAndContent() {
    return (
      <div
        style={{
          flexGrow: '1',
          margin: '32px 64px 32px 64px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {this._title()}
        {this._content()}
      </div>
    );
  }

  _title() {
    return (
      <div>
        <p className={'unselectable-text'} style={{ margin: '0px 8px 0px 8px', fontSize: '24px' }} >
          Open a CT File
        </p>
        <div
          style={{
            height: '0px',
            borderWidth: '0px 0px thin 0px',
            borderStyle: 'solid',
            borderColor: '#bfbfbf',
            margin: '8px 0px 0px 0px',
          }}
        ></div>
      </div>
    );
  }

  _content() {
    return (
      <div
        style={{
          flexGrow: '1',
          margin: '24px 16px 0px 16px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {this._sequenceIdSection()}
        {this._fileSection()}
        {this._errorMessageSection()}
        {this._submitSection()}
      </div>
    );
  }

  _sequenceIdSection() {
    return (
      <div
        style={{
          margin: '0px 0px 0px 0px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {this._sequenceIdLabel()}
        {this._sequenceIdInput()}
      </div>
    );
  }

  _sequenceIdLabel() {
    return (
      <p
        className={'unselectable-text'}
        style={{ margin: '0px 8px 0px 0px', fontSize: '12px', display: 'inline-block' }}
      >
        Sequence ID:
      </p>
    );
  }

  _sequenceIdInput() {
    return (
      <input
        type={'text'}
        value={this.state.sequenceId}
        onChange={event => this._onSequenceIdInputChange(event)}
        spellCheck={'false'}
        placeholder={' ...the name of your sequence'}
        style={{ flexGrow: '1' }}
      />
    );
  }

  _onSequenceIdInputChange(event) {
    this.setState({
      sequenceId: event.target.value,
    });
  }

  _fileSection() {
    return (
      <div style={{ margin: '32px 0px 26px 0px' }} >
        <input type={'file'} />
      </div>
    );
  }

  _errorMessageSection() {
    if (this.state.errorMessage.length === 0) {
      return null;
    } else {
      return (
        <p
          className={'unselectable-text'}
          style={{
            margin: '0px 0px 0px 0px',
            fontSize: '14px',
            color: 'red',
          }}
        >
          <b>{this.state.errorMessage}</b>
        </p>
      );
    }
  }

  _submitSection() {
    return (
      <div style={{ margin: '6px 0px 0px 0px' }} >
        <button
          onClick={() => this._submit()}
          style={{ padding: '4px 32px 4px 32px', fontSize: '12px' }}
        >
          Submit
        </button>
      </div>
    );
  }

  _submit() {}
}

OpenCT.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  submit: PropTypes.func,
};

OpenCT.defaultProps = {
  width: '100vw',
};

export {
  OpenCT,
};
