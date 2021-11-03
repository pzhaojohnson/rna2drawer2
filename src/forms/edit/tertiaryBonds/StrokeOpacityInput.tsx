import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';
import { TertiaryBondInterface } from 'Draw/bonds/curved/TertiaryBondInterface';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
import { parseNumber } from 'Parse/svg/number';
import { round } from 'Math/round';

export type Props = {
  app: App;

  // the tertiary bonds to edit
  tertiaryBonds: TertiaryBondInterface[];
}

type Value = string;

type State = {
  value: Value;
}

// returns an empty string value for an empty tertiary bonds array
// or if not all tertiary bonds have the same stroke opacity
function currStrokeOpacityPercentage(tertiaryBonds: TertiaryBondInterface[]): Value {
  let sops = new Set<Value>();
  tertiaryBonds.forEach(tb => {
    let so = tb.path.attr('stroke-opacity');
    let n = parseNumber(so);
    if (n) {
      let sop = 100 * n.valueOf();
      sop = round(sop, 0);
      sops.add(sop + '%');
    }
  });
  if (sops.size == 1) {
    return sops.values().next().value;
  } else {
    return '';
  }
}

function isBlank(v: Value): boolean {
  return v.trim().length == 0;
}

function areEqual(v1: string, v2: string): boolean {
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

export class StrokeOpacityInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: currStrokeOpacityPercentage(props.tertiaryBonds),
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
      let sop = Number.parseFloat(this.state.value);
      if (Number.isFinite(sop)) {
        if (!areEqual(this.state.value, currStrokeOpacityPercentage(this.props.tertiaryBonds))) {
          this.props.app.pushUndo();
          let so = sop / 100;
          so = constrainOpacity(so);
          so = round(so, 4);
          this.props.tertiaryBonds.forEach(tb => {
            tb.path.attr({ 'stroke-opacity': so });
          });
          TertiaryBond.recommendedDefaults.path['stroke-opacity'] = so;
          this.props.app.refresh();
        }
      }
    }
  }
}
