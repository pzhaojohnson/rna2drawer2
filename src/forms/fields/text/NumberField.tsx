import * as React from 'react';
import TextField from './TextField';
import capitalizeFirstLetter from './capitalizeFirstLetter';

interface Props {
  name: string;
  initialValue?: number;
  checkValue?: (n: number) => string;
  onFocus?: () => void;
  onInput?: () => void;
  onValidInput?: () => void;
  onInvalidInput?: () => void;
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
          let name = capitalizeFirstLetter(this.props.name.toLowerCase());
          if (v.trim().length == 0) {
            return name + ' must be a number.';
          }
          let n = Number(v);
          if (typeof n != 'number' || !Number.isFinite(n)) {
            return name + ' must be a number.';
          }
          if (this.props.checkValue) {
            return this.props.checkValue(n);
          }
          return '';
        }}
        onFocus={this.props.onFocus}
        onInput={this.props.onInput}
        onValidInput={this.props.onValidInput}
        onInvalidInput={this.props.onInvalidInput}
        set={(v: string) => {
          if (v.trim().length > 0) {
            let n = Number(v);
            if (Number.isFinite(n)) {
              this.props.set(n);
            }
          }
        }}
        minLabelWidth={this.props.minLabelWidth}
      />
    );
  }
}

export default NumberField;
