import * as React from 'react';
const uuidv1 = require('uuid/v1');
import { CloseButton } from './CloseButton';
import parseNonemptyFloat from '../parse/number/parseNonemptyFloat';

export interface NumberingProps {
  offset: number;
  anchor: number;
  increment: number;
}

interface Props {
  offset: number;
  anchor: number;
  increment: number;
  apply?(props: NumberingProps): void;
  close?(): void;
}

export class EditBaseNumbering extends React.Component {
  props!: Props;
  state: {
    offset: string;
    anchor: string;
    increment: string;

    errorMessage: string;
    errorMessageKey: string;
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      offset: this.props.offset.toString(),
      anchor: (this.props.anchor + this.props.offset).toString(),
      increment: this.props.increment.toString(),

      errorMessage: '',
      errorMessageKey: uuidv1(),
    };
  }

  render() {
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
        {this.offsetField()}
        {this.anchorField()}
        {this.incrementField()}
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
        Edit Numbering
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

  offsetField() {
    return (
      <div
        style={{
          margin: '24px 40px 0px 40px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {this.offsetLabel()}
        {this.offsetInput()}
      </div>
    );
  }

  offsetLabel() {
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
        Offset:
      </p>
    );
  }

  offsetInput() {
    return (
      <input
        type={'text'}
        value={this.state.offset}
        onChange={event => this.onOffsetInputChange(event)}
        spellCheck={'false'}
        style={{
          width: '180px',
          fontSize: '12px',
          textAlign: 'right',
        }}
      />
    );
  }
  
  onOffsetInputChange(event: React.ChangeEvent) {
    this.setState({
      offset: (event.target as HTMLInputElement).value,
    });
  }

  anchorField() {
    return (
      <div
        style={{
          margin: '12px 40px 0px 40px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {this.anchorLabel()}
        {this.anchorInput()}
      </div>
    );
  }

  anchorLabel() {
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
        Anchor:
      </p>
    );
  }

  anchorInput() {
    return (
      <input
        type={'text'}
        value={this.state.anchor}
        onChange={event => this.onAnchorInputChange(event)}
        spellCheck={'false'}
        style={{
          width: '180px',
          fontSize: '12px',
          textAlign: 'right',
        }}
      />
    );
  }
  
  onAnchorInputChange(event: React.ChangeEvent) {
    this.setState({
      anchor: (event.target as HTMLInputElement).value,
    });
  }

  incrementField() {
    return (
      <div
        style={{
          margin: '12px 40px 18px 40px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {this.incrementLabel()}
        {this.incrementInput()}
      </div>
    );
  }

  incrementLabel() {
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
        Increment:
      </p>
    );
  }

  incrementInput() {
    return (
      <input
        type={'text'}
        value={this.state.increment}
        onChange={event => this.onIncrementInputChange(event)}
        spellCheck={'false'}
        style={{
          width: '180px',
          fontSize: '12px',
          textAlign: 'right',
        }}
      />
    );
  }
  
  onIncrementInputChange(event: React.ChangeEvent) {
    this.setState({
      increment: (event.target as HTMLInputElement).value,
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
    let offset = this.parseOffset();
    if (offset === null) {
      return;
    }
    let anchor = this.parseAnchor();
    if (anchor === null) {
      return;
    }
    let increment = this.parseIncrement();
    if (increment === null) {
      return;
    }
    this.setState({ errorMessage: '', errorMessageKey: uuidv1() });
    if (this.props.apply) {
      this.props.apply({
        offset: offset,
        anchor: anchor,
        increment: increment,
      });
    }
  }

  parseOffset(): (number | null) {
    let o = parseNonemptyFloat(this.state.offset);
    if (o === null || Math.floor(o) !== o) {
      this.setState({ errorMessage: 'Numbering offset must be an integer.', errorMessageKey: uuidv1() });
      return null;
    } else {
      return o;
    }
  }

  parseAnchor(): (number | null) {
    let a = parseNonemptyFloat(this.state.anchor);
    if (a === null || Math.floor(a) !== a) {
      this.setState({ errorMessage: 'Numbering anchor must be an integer.', errorMessageKey: uuidv1() });
      return null;
    } else {
      // use previous offset (not entered offset)
      return a - this.props.offset;
    }
  }

  parseIncrement(): (number | null) {
    let i = parseNonemptyFloat(this.state.increment);
    if (i === null || Math.floor(i) !== i || i < 1) {
      this.setState({ errorMessage: 'Numbering increment must be a positive integer.', errorMessageKey: uuidv1() });
      return null;
    } else {
      return i;
    }
  }
}

export default EditBaseNumbering;
