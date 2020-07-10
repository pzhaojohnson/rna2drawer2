import * as React from 'react';

interface Props {
  name: string;
  initialValue?: string;
  set: (v: string) => void;
}

export class ColorField extends React.Component {
  props!: Props;
  state: {
    value: string;
  }
  prevValue: string;

  constructor(props: Props) {
    super(props);

    let initialValue = this.props.initialValue ?? '#000000';

    this.state = {
      value: initialValue,
    };

    this.prevValue = initialValue;
  }

  render(): React.ReactElement {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type={'color'}
          value={this.state.value}
          onChange={event => this.onChange(event)}
          onFocus={() => this.setIfDifferent()}
          onBlur={() => this.setIfDifferent()}
        />
        <p className={'unselectable-text'} style={{ marginLeft: '6px', fontSize: '12px' }} >
          {this.props.name}
        </p>
      </div>
    );
  }

  onChange(event: React.ChangeEvent) {
    let value = (event.target as HTMLInputElement).value;
    this.setState({ value: value });
  }

  setIfDifferent() {
    if (this.state.value != this.prevValue) {
      this.prevValue = this.state.value;
      this.props.set(this.state.value);
    }
  }
}

export default ColorField;
