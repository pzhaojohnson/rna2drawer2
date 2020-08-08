import * as React from 'react';
import TextField from './TextField';
import capitalizeFirstLetter from './capitalizeFirstLetter';

interface Props {
  name: string;
  initialValue?: number;
  checkValue?: (n: number) => string;
  set: (n: number) => void;
  minLabelWidth?: string;
}

export class NumberField extends React.Component {
  static defaultProps: Props;

  props!: Props;

  render(): React.ReactElement {
    return (
      <TextField
        name={this.props.name}
        initialValue={this.props.initialValue?.toString()}
        checkValue={(v: string) => {
          let n = Number.parseFloat(v);
          let name = capitalizeFirstLetter(this.props.name.toLowerCase());
          if (typeof n !== 'number' || !Number.isFinite(n)) {
            return name + ' must be a number.';
          }
          if (this.props.checkValue) {
            return this.props.checkValue(n);
          }
          return '';
        }}
        set={(v: string) => {
          let n = Number.parseFloat(v);
          this.props.set(n);
        }}
        minLabelWidth={this.props.minLabelWidth}
      />
    );
  }
}

export default NumberField;
