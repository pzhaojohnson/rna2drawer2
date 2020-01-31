import React from 'react';
import PropTypes from 'prop-types';

class OpenSequence extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ignoreNumbers: true,
      ignoreNonAUGCTLetters: true,
      ignoreNonAlphanumerics: true,

      errorMessage: '',
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
        {this._sequenceParsingDetails()}
        {this._errorMessageSection()}
        {this._submitButton()}
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

  _sequenceParsingDetails() {
    return (
      <div style={{ width: '360px', minHeight: '0px', margin: '28px 28px 22px 28px' }} >
        <p className={'unselectable-text'} style={{ fontWeight: 'bold', fontSize: '14px' }} >
          Sequence Parsing Details:
        </p>
        <div style={{ marginLeft: '8px' }} >
          <p className={'unselectable-text'} style={{ marginTop: '8px', fontSize: '12px' }} >
            All letters, numbers, and non-alphanumeric characters are read in as individual bases, unless specified to be ignored below:
          </p>
          {this._ignoreNumbersCheckbox()}
          {this._ignoreNonAUGCTLettersCheckbox()}
          {this._ignoreNonAlphanumericsCheckbox()}
          <p className={'unselectable-text'} style={{ marginTop: '16px', fontSize: '12px' }}>
            All whitespace is ignored.
          </p>
        </div>
      </div>
    );
  }

  _ignoreNumbersCheckbox() {
    return (
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type={'checkbox'}
          checked={this.state.ignoreNumbers}
          onChange={() => this._toggleIgnoreNumbers()}
        />
        <p className={'unselectable-text'} style={{ marginLeft: '6px', fontSize: '12px' }} >
          Ignore numbers.
        </p>
      </div>
    );
  }

  _toggleIgnoreNumbers() {
    this.setState({
      ignoreNumbers: !this.state.ignoreNumbers,
    });
  }

  _ignoreNonAUGCTLettersCheckbox() {
    return (
      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type={'checkbox'}
          checked={this.state.ignoreNonAUGCTLetters}
          onChange={() => this._toggleIgnoreNonAUGCTLetters()}
        />
        <p className={'unselectable-text'} style={{ marginLeft: '6px', fontSize: '12px' }} >
          Ignore non-AUGCT letters.
        </p>
      </div>
    );
  }

  _toggleIgnoreNonAUGCTLetters() {
    this.setState({
      ignoreNonAUGCTLetters: !this.state.ignoreNonAUGCTLetters,
    });
  }

  _ignoreNonAlphanumericsCheckbox() {
    return (
      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type={'checkbox'}
          checked={this.state.ignoreNonAlphanumerics}
          onChange={() => this._toggleIgnoreNonAlphanumerics()}
        />
        <p className={'unselectable-text'} style={{ marginLeft: '6px', fontSize: '12px' }} >
          Ignore non-alphanumeric characters.
        </p>
      </div>
    );
  }

  _toggleIgnoreNonAlphanumerics() {
    this.setState({
      ignoreNonAlphanumerics: !this.state.ignoreNonAlphanumerics,
    });
  }

  _errorMessageSection() {
    if (this.state.errorMessage.length === 0) {
      return null;
    } else {
      return (
        <p
          className={'unselectable-text'}
          style={{
            margin: '0px 28px 0px 28px',
            fontSize: '14px',
            color: 'red',
          }}
        >
          {this.state.errorMessage}
        </p>
      );
    }
  }

  _submitButton() {
    return (
      <div style={{ margin: '6px 28px 16px 28px' }} >
        <button
          onClick={() => this._submit()}
          style={{ padding: '4px 32px 4px 32px', fontSize: '12px' }}
        >
          Submit
        </button>
      </div>
    );
  }
}

OpenSequence.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  closeCallback: PropTypes.func,
}

OpenSequence.defaultProps = {
  width: '100vw',
  height: '100%',
}

export default OpenSequence;
