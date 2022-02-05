import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { interpretNumber } from 'Draw/svg/interpretNumber';
import { round } from 'Math/round';

export type Props = {
  app: App;

  // the bases to edit
  bases: Base[];
}

type Value = string;

type State = {
  value: Value;
}

// returns an empty string value for an empty bases array
// or if not all bases have the same fill opacity
function currFillOpacityPercentage(bases: Base[]): Value {
  let fops = new Set<Value>();
  bases.forEach(b => {
    let fo = b.text.attr('fill-opacity');
    let n = interpretNumber(fo);
    if (n) {
      let fop = 100 * n.valueOf();
      fop = round(fop, 0);
      fops.add(fop + '%');
    }
  });
  if (fops.size == 1) {
    return fops.values().next().value;
  } else {
    return '';
  }
}

function isBlank(v: Value): boolean {
  return v.trim().length == 0;
}

function areEqual(v1: Value, v2: Value): boolean {
  return Number.parseFloat(v1) == Number.parseFloat(v2);
}

function constrainOpacity(o: number): number {
  if (!Number.isFinite(o)) {
    return 1;
  } else if (o < 0) {
    return 0;
  } else if (o > 1) {
    return 1;
  } else {
    return o;
  }
}

export class FillOpacityInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: currFillOpacityPercentage(props.bases),
    };
  }

  render() {
    return (
      <input
        type='text'
        className={textFieldStyles.input}
        value={this.state.value}
        onChange={event => this.setState({ value: event.target.value })}
        onBlur={() => {
          this.submit();
          this.props.app.refresh();
        }}
        onKeyUp={event => {
          if (event.key.toLowerCase() == 'enter') {
            this.submit();
            this.props.app.refresh();
          }
        }}
        style={{ width: '32px', textAlign: 'end' }}
      />
    );
  }

  submit() {
    if (!isBlank(this.state.value)) {
      let fop = Number.parseFloat(this.state.value);
      if (Number.isFinite(fop)) {
        if (!areEqual(this.state.value, currFillOpacityPercentage(this.props.bases))) {
          this.props.app.pushUndo();
          let fo = fop / 100;
          fo = constrainOpacity(fo);
          fo = round(fo, 4);
          this.props.bases.forEach(b => {
            b.text.attr({ 'fill-opacity': fo });
          });
          this.props.app.refresh();
        }
      }
    }
  }
}
