import * as React from 'react';
import IntegerField from './IntegerField';
import capitalizeFirstLetter from './capitalizeFirstLetter';

interface Props {
  name: string;
  initialValue: number;
  set: (n: number) => void;
  minLabelWidth?: string;
}

export class PositiveIntegerField extends React.Component {
  props!: Props;

  render(): React.ReactElement {
    return (
      <IntegerField
        name={this.props.name}
        initialValue={this.props.initialValue}
        checkValue={(n: number) => {
          let name = capitalizeFirstLetter(this.props.name.toLowerCase());
          if (n < 1) {
            return name + ' must be positive.';
          }
          return '';
        }}
        set={(n: number) => this.props.set(n)}
        minLabelWidth={this.props.minLabelWidth}
      />
    );
  }
}

export default PositiveIntegerField;
