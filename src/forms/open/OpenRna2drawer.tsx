import * as React from 'react';
import { UnclosableFlexContainer } from '../containers/UnclosableFlexContainer';
import { ActionButton } from '../buttons/ActionButton';
const uuidv1 = require('uuid/v1');
import parseFileExtension from '../../parse/parseFileExtension';

interface Props {
  width: string | number;
  submit?: (saved: string, fileExtension: string) => boolean;
  errorMessages?: {
    noFileUploaded?: string;
    fileUploadError?: string;
    wrongFileType?: string;
    invalidFile?: string;
  }
}

class OpenRna2drawer extends React.Component {
  static defaultProps: Props;

  props!: Props;
  state: {
    attemptedFileUpload: boolean;
    fileUploaded: boolean;
    fileExtension: string;
    fileContents: string;

    errorMessage: string;
    errorMessageKey: string;
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      attemptedFileUpload: false,
      fileUploaded: false,
      fileExtension: '',
      fileContents: '',

      errorMessage: '',
      errorMessageKey: uuidv1(),
    };
  }

  render() {
    return (
      <UnclosableFlexContainer
        title={'Open an RNA2Drawer File'}
        contained={(
          <div
            style={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {this.fileUpload()}
            {this.oldFileDisclaimer()}
            {this.errorSection()}
            {this.submitSection()}
          </div>
        )}
      />
    );
  }

  fileUpload() {
    return (
      <div style={{ margin: '8px 0px 0px 0px' }} >
        <input
          type={'file'}
          onChange={event => this.onFileInputChange(event)}
        />
      </div>
    );
  }

  onFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length == 0) {
      return;
    }
    let f = event.target.files[0];
    this.setState({
      attemptedFileUpload: true,
      fileExtension: parseFileExtension(f.name),
      errorMessage: '',
      errorMessageKey: uuidv1(),
    });
    let fr = new FileReader();
    fr.addEventListener('load', () => {
      this.setState({
        fileUploaded: true,
        fileContents: fr.result,
      });
    });
    fr.readAsText(f);
  }

  oldFileDisclaimer() {
    let fe = this.state.fileExtension.toLowerCase();
    let marginBottom = fe == 'rna2drawer' ? '18px' : '14px';
    let margin = '12px 0px ' + marginBottom + ' 0px';
    return (
      <div style={{ margin: margin }} >
        {fe != 'rna2drawer' ? null : (
          <div style={{ animationName: 'fadein', animationDuration: '0.75s' }} >
            <p className={'unselectable-text'} >
              <b>Note:</b> Not all aspects of a drawing from the first version of RNA2Drawer will be preserved. The following will be preserved:
            </p>
            <div style={{ margin: '6px 0px 0px 12px' }} >
              <p className={'unselectable-text'} >
                The sequence and its ID, the secondary structure, tertiary interactions and their colors,
                base numbering and the numbering offset, and base colors and outlines.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  errorSection() {
    if (!this.state.errorMessage) {
      return this.emptyErrorSection();
    }
    return (
      <div
        key={this.state.errorMessageKey}
        id={this.state.errorMessageKey}
      >
        {this.errorText()}
      </div>
    );
  }

  emptyErrorSection() {
    return (
      <div
        key={this.state.errorMessageKey}
        id={this.state.errorMessageKey}
      ></div>
    );
  }

  errorText() {
    return (
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
    );
  }

  submitSection() {
    return (
      <div style={{ margin: '6px 0px 0px 0px' }} >
        <ActionButton text={'Submit'} onClick={() => this.submit()} />
      </div>
    );
  }

  submit() {
    if (!this.checkUpload()) {
      return;
    }
    if (!this.checkFileExtension()) {
      return;
    }
    if (!this.props.submit) {
      console.error('Missing submit callback.');
      return;
    }
    let opened = this.props.submit(this.state.fileContents, this.state.fileExtension);
    if (!opened) {
      let em = 'Invalid RNA2Drawer file.';
      if (this.props.errorMessages && this.props.errorMessages.invalidFile) {
        em = this.props.errorMessages.invalidFile;
      }
      this.setState({
        errorMessage: em,
        errorMessageKey: uuidv1(),
      });
    }
  }

  checkUpload() {
    if (this.state.fileUploaded) {
      return true;
    }
    if (this.state.attemptedFileUpload) {
      let em = 'Unable to read selected file.';
      if (this.props.errorMessages && this.props.errorMessages.fileUploadError) {
        em = this.props.errorMessages.fileUploadError;
      }
      this.setState({
        errorMessage: em,
        errorMessageKey: uuidv1(),
      });
      return false;
    }
    let em = 'No file uploaded.';
    if (this.props.errorMessages && this.props.errorMessages.noFileUploaded) {
      em = this.props.errorMessages.noFileUploaded;
    }
    this.setState({
      errorMessage: em,
      errorMessageKey: uuidv1(),
    });
    return false;
  }

  checkFileExtension() {
    let fe = this.state.fileExtension.toLowerCase();
    if (fe == 'rna2drawer' || fe == 'rna2drawer2') {
      return true;
    }
    let em = 'File must have .rna2drawer extension.';
    if (this.props.errorMessages && this.props.errorMessages.wrongFileType) {
      em = this.props.errorMessages.wrongFileType;
    }
    this.setState({
      errorMessage: em,
      errorMessageKey: uuidv1(),
    });
    return false;
  }
}

OpenRna2drawer.defaultProps = {
  width: '100vw',
  errorMessages: {
    noFileUploaded: 'No file uploaded.',
    fileUploadError: 'Unable to read selected file.',
    wrongFileType: 'File must have .rna2drawer extension.',
    invalidFile: 'Invalid RNA2Drawer file.',
  },
};

export default OpenRna2drawer;
