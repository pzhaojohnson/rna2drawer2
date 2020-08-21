import * as React from 'react';
import NumberField from './NumberField';
import capitalizeFirstLetter from './capitalizeFirstLetter';

interface Props {
  name: string;
  initialValue?: number;
  onInvalidInput?: () => void;
  set: (n: number) => void;
  minLabelWidth?: string;
}

export class NonnegativeNumberField extends React.Component {
  static defaultProps: Props;

  props!: Props;

  render(): React.ReactElement {
    return (
      <NumberField
        name={this.props.name}
        initialValue={this.props.initialValue}
        checkValue={(n: number) => {
          let name = capitalizeFirstLetter(this.props.name.toLowerCase());
          if (n < 0) {
            return name + ' cannot be less than zero.';
          }
          return '';
        }}
        onInvalidInput={this.props.onInvalidInput}
        set={(n: number) => this.props.set(n)}
        minLabelWidth={this.props.minLabelWidth}
      />
    );
  }
}

export default NonnegativeNumberField;
