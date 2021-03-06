import * as React from 'react';
import ErrorMessage from '../../ErrorMessage';

interface Props {
  name: string;
  initialValue?: string;
  checkValue?: (v: string) => string;
  onFocus?: () => void;
  onInput?: () => void;
  onValidInput?: () => void;
  onInvalidInput?: () => void;
  set: (v: string) => void;
  minLabelWidth?: string;
}

export class TextField extends React.Component {
  static defaultProps: Props;
  static nameOfLastEntered: string;

  props!: Props;
  state: {
    value: string;
    errorMessage: string;
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.initialValue ?? '',
      errorMessage: '',
    };
  }

  render(): React.ReactElement {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }} >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
          {this.label()}
          {this.input()}
        </div>
        <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
          <div style={{ flexGrow: 1 }} ></div>
          <ErrorMessage message={this.state.errorMessage} />
        </div>
      </div>
    );
  }

  label(): React.ReactElement {
    return (
      <p
        className={'unselectable-text'}
        style={{
          marginRight: '12px',
          minWidth: this.props.minLabelWidth,
          fontSize: '12px',
          display: 'inline-block',
        }}
      >
        {this.props.name + ':'}
      </p>
    );
  }

  input(): React.ReactElement {
    return (
      <input
        type={'text'}
        value={this.state.value}
        onChange={event => this.onInputChange(event)}
        onFocus={this.props.onFocus}
        onBlur={() => this.onBlur()}
        onKeyUp={event => this.onKeyUp(event)}
        autoFocus={TextField.nameOfLastEntered == this.props.name}
        spellCheck={'false'}
        style={{ flexGrow: 1, fontSize: '12px', textAlign: 'right' }}
      />
    );
  }

  onInputChange(event: React.ChangeEvent) {
    let value = (event.target as HTMLInputElement).value;
    let checkValue = this.props.checkValue;
    let errorMessage = checkValue ? checkValue(value) : '';
    this.setState({
      value: value,
      errorMessage: errorMessage,
    });
    this.props.onInput ? this.props.onInput() : undefined;
    if (errorMessage) {
      this.props.onInvalidInput ? this.props.onInvalidInput() : undefined;
    } else {
      this.props.onValidInput ? this.props.onValidInput() : undefined;
    }
  }

  onBlur() {
    TextField.nameOfLastEntered = '';
    this.onBlurAndEnter();
  }

  onKeyUp(event: React.KeyboardEvent) {
    if (event.key.toLowerCase() == 'enter') {
      TextField.nameOfLastEntered = this.props.name;
      this.onBlurAndEnter();
    }
  }

  onBlurAndEnter() {
    let em = this.props.checkValue ? this.props.checkValue(this.state.value) : '';
    if (!em) {
      this.props.set(this.state.value);
    }
  }
}

TextField.defaultProps = {
  name: '*** Missing Name ***',
  initialValue: '',
  checkValue: () => '',
  set: () => console.error('Missing set callback.'),
  minLabelWidth: '108px',
};

export default TextField;
