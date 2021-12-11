import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';
import { PrimaryBondInterface } from 'Draw/bonds/straight/PrimaryBondInterface';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { round } from 'Math/round';

export type Props = {
  app: App;

  // the primary bonds to edit
  primaryBonds: PrimaryBondInterface[];
}

type Value = string;

type State = {
  value: Value;
}

// returns an empty string value for an empty primary bonds array
// or if not all primary bonds have the same base padding
function currBasePadding(primaryBonds: PrimaryBondInterface[]): Value {
  let bps = new Set<Value>();
  primaryBonds.forEach(pb => {
    let bp1 = round(pb.basePadding1, 0);
    let bp2 = round(pb.basePadding2, 0);
    bps.add(bp1.toString());
    bps.add(bp2.toString());
  });
  if (bps.size == 1) {
    return bps.values().next().value;
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

export class BasePaddingField extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: currBasePadding(props.primaryBonds),
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
          style={{ width: '32px' }}
        />
        <p
          className={`${textFieldStyles.label} unselectable`}
          style={{ marginLeft: '8px' }}
        >
          Base Padding
        </p>
      </div>
    );
  }

  submit() {
    if (!isBlank(this.state.value)) {
      let bp = Number.parseFloat(this.state.value);
      if (Number.isFinite(bp)) {
        if (!areEqual(this.state.value, currBasePadding(this.props.primaryBonds))) {
          this.props.app.pushUndo();
          bp = constrainBasePadding(bp);
          bp = round(bp, 0);
          this.props.primaryBonds.forEach(pb => {
            pb.basePadding1 = bp;
            pb.basePadding2 = bp;
          });
          PrimaryBond.recommendedDefaults.basePadding1 = bp;
          PrimaryBond.recommendedDefaults.basePadding2 = bp;
          this.props.app.refresh();
        }
      }
    }
  }
}
