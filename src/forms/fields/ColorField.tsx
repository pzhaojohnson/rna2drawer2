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

  constructor(props: Props) {
    super(props);

    this.state = {
      value: this.props.initialValue ?? '#000000',
    };
  }

  render(): React.ReactElement {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type={'color'}
          value={this.state.value}
          onChange={event => this.onChange(event)}
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
    this.props.set(value);
  }
}

export default ColorField;
