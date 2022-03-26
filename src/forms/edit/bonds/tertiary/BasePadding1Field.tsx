import * as React from 'react';
import textFieldStyles from 'Forms/inputs/text/TextField.css';
import type { App } from 'App';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
import { round } from 'Math/round';

export type Props = {
  app: App;

  // the tertiary bonds to edit
  tertiaryBonds: TertiaryBond[];
}

type Value = string;

type State = {
  value: Value;
}

// returns an empty string value for an empty tertiary bonds array
// or if not all tertiary bonds have the same base padding 1
function currBasePadding1(tertiaryBonds: TertiaryBond[]): Value {
  let bp1s = new Set<Value>();
  tertiaryBonds.forEach(tb => {
    let bp1 = round(tb.basePadding1, 0);
    bp1s.add(bp1.toString());
  });
  if (bp1s.size == 1) {
    return bp1s.values().next().value;
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

function constrainBasePadding(bp: number): number {
  if (!Number.isFinite(bp)) {
    return 0;
  } else if (bp < 0) {
    return 0;
  } else {
    return bp;
  }
}

export class BasePadding1Field extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: currBasePadding1(props.tertiaryBonds),
    }
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
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
          style={{ width: '36px' }}
        />
        <div style={{ marginLeft: '8px' }} >
          <p className={`${textFieldStyles.label} unselectable`} >
            Base Padding 1
          </p>
        </div>
      </div>
    );
  }

  submit() {
    if (!isBlank(this.state.value)) {
      let bp1 = Number.parseFloat(this.state.value);
      if (Number.isFinite(bp1)) {
        if (!areEqual(this.state.value, currBasePadding1(this.props.tertiaryBonds))) {
          this.props.app.pushUndo();
          bp1 = constrainBasePadding(bp1);
          bp1 = round(bp1, 0);
          this.props.tertiaryBonds.forEach(tb => {
            tb.basePadding1 = bp1;
          });
          TertiaryBond.recommendedDefaults.basePadding1 = bp1;
          this.props.app.refresh();
        }
      }
    }
  }
}
