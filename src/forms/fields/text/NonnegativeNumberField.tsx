import * as React from 'react';
import NumberField from './NumberField';

interface Props {
  name: string;
  initialValue: number;
  set: (n: number) => void;
  minLabelWidth?: string;
}

export class NonnegativeNumberField extends React.Component {
  props!: Props;

  render(): React.ReactElement {
    return (
      <NumberField
        name={this.props.name}
        initialValue={this.props.initialValue}
        checkValue={(n: number) => {
          if (n < 0) {
            return this.props.name + ' cannot be less than zero.';
          }
          return '';
        }}
        set={(n: number) => this.props.set(n)}
        minLabelWidth={this.props.minLabelWidth}
      />
    );
  }
}

export default NonnegativeNumberField;
