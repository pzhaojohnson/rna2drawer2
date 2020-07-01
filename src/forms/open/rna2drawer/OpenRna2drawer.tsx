import * as React from 'react';
const uuidv1 = require('uuid/v1');
import parseFileExtension from '../../../parse/parseFileExtension';

interface Props {
  width: string | number;
  submit?: (o: object) => boolean;
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
    fileExtension: string;
    fileContents: string | null;

    errorMessage: string;
    errorMessageKey: string;
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      attemptedFileUpload: false,
      fileExtension: '',
      fileContents: null,
      
      errorMessage: '',
      errorMessageKey: uuidv1(),
    };
  }

  render() {
    return (
      <div
        style={{
          width: this.props.width,
          height: '100%',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {this.boundingDivs()}
      </div>
    );
  }

  boundingDivs() {
    return (
      <div
        style={{
          flexGrow: 1,
          maxHeight: '824px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            flexGrow: 1,
            maxWidth: '1200px',
            margin: '12px',
            border: 'thin solid #bfbfbf',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {this.titleAndContent()}
        </div>
      </div>
    );
  }

  titleAndContent() {
    return (
      <div
        style={{
          flexGrow: 1,
          margin: '32px 80px 32px 80px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {this.title()}
        {this.content()}
      </div>
    );
  }

  title() {
    return (
      <div>
        {this.titleText()}
        {this.titleUnderline()}
      </div>
    );
  }

  titleText() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          margin: '0px 24px 0px 24px',
          fontSize: '24px',
        }}
      >
        Open an RNA2Drawer 2 File
      </p>
    );
  }

  titleUnderline() {
    return (
      <div
        style={{
          height: '0px',
          borderWidth: '0px 0px thin 0px',
          borderStyle: 'solid',
          borderColor: '#bfbfbf',
          margin: '8px 0px 0px 0px',
        }}
      ></div>
    );
  }

  content() {
    return (
      <div
        style={{
          flexGrow: 1,
          margin: '32px 40px 0px 40px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {this.fileUpload()}
        {this.errorSection()}
        {this.submitSection()}
      </div>
    );
  }

  fileUpload() {
    return (
      <div style={{ margin: '0px 0px 26px 0px' }} >
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
        fileContents: fr.result,
      });
    });
    fr.readAsText(f);
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
        <button
          onClick={() => this.submit()}
          style={{
            padding: '4px 32px 4px 32px',
            fontSize: '12px',
            borderRadius: '2px',
          }}
        >
          Submit
        </button>
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
    let savedState = this.parseSavedState();
    if (!savedState) {
      return;
    }
    if (!this.props.submit) {
      console.error('Missing submit callback.');
      return;
    }
    if (!this.props.submit(savedState)) {
      let em = 'Invalid RNA2Drawer 2 file.';
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
    if (this.state.fileContents) {
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
    if (this.state.fileExtension === 'rna2drawer2') {
      return true;
    }
    let em = 'File must have .rna2drawer2 extension.';
    if (this.props.errorMessages && this.props.errorMessages.wrongFileType) {
      em = this.props.errorMessages.wrongFileType;
    }
    this.setState({
      errorMessage: em,
      errorMessageKey: uuidv1(),
    });
    return false;
  }

  parseSavedState() {
    try {
      if (!this.state.fileContents) {
        throw new Error('Invalid RNA2Drawer 2 file.');
      } else {
        return JSON.parse(this.state.fileContents);
      }
    } catch (err) {
      let em = 'Invalid RNA2Drawer 2 file.';
      if (this.props.errorMessages && this.props.errorMessages.invalidFile) {
        em = this.props.errorMessages.invalidFile;
      }
      this.setState({
        errorMessage: em,
        errorMessageKey: uuidv1(),
      });
      return null;
    }
  }
}

OpenRna2drawer.defaultProps = {
  width: '100vw',
  errorMessages: {
    noFileUploaded: 'No file uploaded.',
    fileUploadError: 'Unable to read selected file.',
    wrongFileType: 'File must have .rna2drawer2 extension.',
    invalidFile: 'Invalid RNA2Drawer 2 file.',
  },
};

export default OpenRna2drawer;
