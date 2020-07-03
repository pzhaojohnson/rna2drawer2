import * as React from 'react';
import ErrorMessage from './ErrorMessage';

interface Props {
  name: string;
  initialValue: string;
  checkValue: (v: string) => string;
  set: (v: string) => void;
}

export class TextField extends React.Component {
  static defaultProps: Props;
  static wasEntered: boolean;

  props!: Props;
  state: {
    value: string;
    errorMessage: string;
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.initialValue,
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
        onBlur={() => this.onBlur()}
        onKeyUp={event => this.onKeyUp(event)}
        autoFocus={TextField.wasEntered}
        spellCheck={'false'}
        style={{ flexGrow: 1, fontSize: '12px', textAlign: 'right' }}
      />
    );
  }

  onInputChange(event: React.ChangeEvent) {
    let value = (event.target as HTMLInputElement).value;
    let errorMessage = this.props.checkValue(value);
    this.setState({
      value: value,
      errorMessage: errorMessage,
    });
  }

  onBlur() {
    TextField.wasEntered = false;
    this.onBlurAndEnter();
  }

  onKeyUp(event: React.KeyboardEvent) {
    if (event.key.toLowerCase() == 'enter') {
      TextField.wasEntered = true;
      this.onBlurAndEnter();
    }
  }

  onBlurAndEnter() {
    if (!this.state.errorMessage.trim()) {
      this.props.set(this.state.value);
    }
  }
}

TextField.defaultProps = {
  name: '*** Missing Name ***',
  initialValue: '',
  checkValue: () => '',
  set: () => console.error('Missing set callback.'),
};

export default TextField;
