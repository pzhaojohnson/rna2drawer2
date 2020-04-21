import React from 'react';
import PropTypes from 'prop-types';
import {
  parseCT,
  numSequencesInCT,
} from '../parse/parseCT';
const uuidv1 = require('uuid/v1');

class OpenCT extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sequenceId: '',
      
      attemptedFileLoad: false,
      fileContents: null,
      
      errorMessageKey: uuidv1(),
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
              borderRadius: '24px',
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
          margin: '32px 48px 32px 48px',
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
        <p className={'unselectable-text'} style={{ margin: '0px 24px 0px 24px', fontSize: '24px' }} >
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
          margin: '24px 40px 0px 40px',
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
        <input
          type={'file'}
          onChange={event => this._onFileInputChange(event)}
        />
      </div>
    );
  }

  _onFileInputChange(event) {
    if (event.target.files.length > 0) {
      this.setState({
        attemptedFileLoad: true,
        errorMessageKey: uuidv1(),
        errorMessage: '',
      });
      let fr = new FileReader();
      fr.addEventListener('load', () => {
        this.setState({
          fileContents: fr.result,
        });
      });
      fr.readAsText(event.target.files[0]);
    }
  }

  _errorMessageSection() {
    if (this.state.errorMessage.length === 0) {
      return (
        <div
          key={this.state.errorMessageKey}
          id={this.state.errorMessageKey}
        ></div>
      );
    } else {
      return (
        <div
          key={this.state.errorMessageKey}
          id={this.state.errorMessageKey}
        >
          <p
            className={'unselectable-text'}
            style={{
              margin: '0px 0px 0px 0px',
              fontSize: '14px',
              color: 'red',
              animationName: 'fadein',
              animationDuration: '0.75s',
            }}
          >
            <b>{this.state.errorMessage}</b>
          </p>
        </div>
      );
    }
  }

  _submitSection() {
    return (
      <div style={{ margin: '6px 0px 0px 0px' }} >
        <button
          onClick={() => this._submit()}
          style={{
            padding: '4px 32px 4px 32px',
            fontSize: '12px',
            borderRadius: '4px',
          }}
        >
          Submit
        </button>
      </div>
    );
  }

  _submit() {
    let sequenceId = this._parseSequenceId();
    if (sequenceId === null) {
      return;
    }
    let ct = this._parseCT();
    if (ct === null) {
      return;
    }
    this.props.submit(
      sequenceId,
      ct.sequence,
      ct.partners,
      ct.numberingOffset,
    );
  }

  /**
   * Returns null if the sequence ID is empty.
   * 
   * @returns {string|null} 
   */
  _parseSequenceId() {
    let id = this.state.sequenceId.trim();
    if (id.length === 0) {
      this.setState({
        errorMessageKey: uuidv1(),
        errorMessage: 'Sequence ID is empty.',
      });
      return null;
    } else {
      return id;
    }
  }

  /**
   * @typedef {Object} OpenCT~ParsedCT 
   * @property {string} sequence 
   * @property {Array<number|null>} partners 
   * @property {number} numberingOffset 
   */

  /**
   * Returns null if the user has not uploaded a file, if the file
   * is unable to be read, if the CT file is invalid, or if the CT
   * file specifies a structure of length zero.
   * 
   * @returns {OpenCT~ParsedCT|null}
   */
  _parseCT() {
    if (this.state.fileContents === null) {
      if (this.state.attemptedFileLoad) {
        this.setState({ errorMessageKey: uuidv1(), errorMessage: 'Unable to read selected file.' });
      } else {
        this.setState({ errorMessageKey: uuidv1(), errorMessage: 'No file uploaded.' });
      }
      return null;
    }
    let ct = parseCT(this.state.fileContents);
    if (ct === null) {
      if (numSequencesInCT(this.state.fileContents) === 0) {
        this.setState({ errorMessageKey: uuidv1(), errorMessage: 'No structure found in CT file.' });
      } else if (numSequencesInCT(this.state.fileContents) > 1) {
        this.setState({ errorMessageKey: uuidv1(), errorMessage: 'Multiple structures in CT file.' });
      } else {
        this.setState({ errorMessageKey: uuidv1(), errorMessage: 'Invalid CT file.' });
      }
      return null;
    }
    if (ct.sequence.length === 0) {
      this.setState({ errorMessageKey: uuidv1(), errorMessage: 'Structure has a length of zero.' });
      return null;
    }
    return ct;
  }
}

OpenCT.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  submit: PropTypes.func,
};

OpenCT.defaultProps = {
  width: '100vw',
  submit: () => {},
};

export {
  OpenCT,
};
