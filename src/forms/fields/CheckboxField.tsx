import * as React from 'react';

interface Props {
  name: string;
  initialValue: boolean;
  set: (v: boolean) => void;
}

export class CheckboxField extends React.Component {
  static defaultProps: Props;

  props!: Props;
  state: {
    value: boolean;
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      value: this.props.initialValue,
    };
  }

  render(): React.ReactElement {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type={'checkbox'}
          checked={this.props.initialValue}
          onChange={() => this.onChange()}
        />
        <p className={'unselectable-text'} style={{ marginLeft: '6px', fontSize: '12px' }} >
          {this.props.name}
        </p>
      </div>
    );
  }

  onChange() {
    let value = !this.state.value;
    this.setState({ value: value });
    this.props.set(value);
  }
}

CheckboxField.defaultProps = {
  name: '*** Missing Name ***',
  initialValue: false,
  set: () => console.error('Missing set callback.'),
};

export default CheckboxField;
