import * as React from 'react';
import NumberField from './NumberField';
import capitalizeFirstLetter from './capitalizeFirstLetter';

interface Props {
  name: string;
  initialValue: number;
  checkValue?: (n: number) => string;
  set: (n: number) => void;
  minLabelWidth?: string;
}

export class IntegerField extends React.Component {
  props!: Props;

  render(): React.ReactElement {
    return (
      <NumberField
        name={this.props.name}
        initialValue={this.props.initialValue}
        checkValue={(n: number) => {
          let name = capitalizeFirstLetter(this.props.name.toLowerCase());
          if (Math.floor(n) !== n) {
            return name + ' must be an integer.';
          }
          if (this.props.checkValue) {
            return this.props.checkValue(n);
          }
          return '';
        }}
        set={(n: number) => this.props.set(n)}
        minLabelWidth={this.props.minLabelWidth}
      />
    );
  }
}

export default IntegerField;
