import * as React from 'react';
const uuidv1 = require('uuid/v1');
import { CloseButton } from '../../CloseButton';
import isAllWhitespace from '../../../parse/isAllWhitespace';

interface Props {
  currId: string;
  apply?(id: string): void;
  close?(): void;
}

export class EditSequenceId extends React.Component {
  static defaultProps: Props;

  props!: Props;
  state: {
    id: string;

    errorMessage: string;
    errorMessageKey: string;
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      id: this.props.currId,

      errorMessage: '',
      errorMessageKey: uuidv1(),
    };
  }

  render(): React.ReactElement {
    return (
      <div
        style={{
          position: 'relative',
          width: '400px',
          height: '100%',
          backgroundColor: '#ffffff',
          borderWidth: '0px 0px 0px thin',
          borderStyle: 'solid',
          borderColor: '#bfbfbf',
        }}
      >
        {this.closeButton()}
        {this.titleAndContent()}
      </div>
    );
  }

  closeButton() {
    return (
      <CloseButton
        position={'absolute'}
        top={'0px'}
        right={'0px'}
        onClick={() => this.props.close ? this.props.close() : undefined}
      />
    );
  }

  titleAndContent() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {this.titleSection()}
        {this.idField()}
        {this.errorMessageSection()}
        {this.applySection()}
      </div>
    );
  }

  titleSection() {
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
          margin: '16px 32px 0px 32px',
          fontSize: '24px',
        }}
      >
        Edit Sequence ID
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
          margin: '8px 16px 0px 16px',
        }}
      ></div>
    );
  }

  idField() {
    return (
      <div
        style={{
          margin: '24px 40px 18px 40px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {this.idLabel()}
        {this.idInput()}
      </div>
    );
  }

  idLabel() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          flexGrow: 1,
          marginRight: '8px',
          fontSize: '12px',
          display: 'inline-block',
        }}
      >
        Sequence ID:
      </p>
    );
  }

  idInput() {
    return (
      <input
        type={'text'}
        value={this.state.id}
        onChange={event => this.onIdInputChange(event)}
        spellCheck={'false'}
        style={{
          width: '180px',
          fontSize: '12px',
          textAlign: 'right',
        }}
      />
    );
  }
  
  onIdInputChange(event: React.ChangeEvent) {
    this.setState({
      id: (event.target as HTMLInputElement).value,
    });
  }

  errorMessageSection() {
    if (!this.state.errorMessage) {
      return this.emptyErrorMessageSection();
    }
    return (
      <div
        key={this.state.errorMessageKey}
        id={this.state.errorMessageKey} 
      >
        {this.errorMessageText()}
      </div>
    );
  }

  emptyErrorMessageSection() {
    return (
      <div
        key={this.state.errorMessageKey}
        id={this.state.errorMessageKey}
      ></div>
    );
  }

  errorMessageText() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          margin: '0px 40px 0px 40px',
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

  applySection() {
    return (
      <div
        style={{
          margin: '6px 40px 0px 40px',
        }}
      >
        {this.applyButton()}
      </div>
    );
  }

  applyButton() {
    return (
      <button
        onClick={() => this.apply()}
        style={{
          padding: '4px 32px 4px 32px',
          fontSize: '12px',
          borderRadius: '2px',
        }}
      >
        Apply
      </button>
    );
  }

  apply() {
    let id = this.state.id;
    if (id.length == 0 || isAllWhitespace(id)) {
      this.setState({ errorMessage: 'Sequence ID cannot be empty.', errorMessageKey: uuidv1() });
      return;
    }
    this.setState({ errorMessage: '', errorMessageKey: uuidv1() });
    if (this.props.apply) {
      this.props.apply(id.trim());
    };
  }
}

EditSequenceId.defaultProps = {
  currId: '',
};

export default EditSequenceId;
