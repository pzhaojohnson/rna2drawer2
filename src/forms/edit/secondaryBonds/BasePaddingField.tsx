import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';
import { SecondaryBondInterface, secondaryBondTypes } from 'Draw/bonds/straight/SecondaryBondInterface';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { round } from 'Math/round';

export type Props = {
  app: App;

  // the secondary bonds to edit
  secondaryBonds: SecondaryBondInterface[];
}

type Value = string;

type State = {
  value: Value;
}

// returns an empty string value for an empty secondary bonds array
// or if not all secondary bonds have the same base padding
function currBasePadding(secondaryBonds: SecondaryBondInterface[]): Value {
  let bps = new Set<Value>();
  secondaryBonds.forEach(sb => {
    let bp1 = round(sb.basePadding1, 1);
    let bp2 = round(sb.basePadding2, 1);
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
      value: currBasePadding(props.secondaryBonds),
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
            this.props.app.drawingChangedNotByInteraction();
          }}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              this.submit();
              this.props.app.drawingChangedNotByInteraction();
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
        if (!areEqual(this.state.value, currBasePadding(this.props.secondaryBonds))) {
          this.props.app.pushUndo();
          bp = constrainBasePadding(bp);
          bp = round(bp, 2);
          this.props.secondaryBonds.forEach(sb => {
            sb.basePadding1 = bp;
            sb.basePadding2 = bp;
          });
          secondaryBondTypes.forEach(t => {
            SecondaryBond.recommendedDefaults[t].basePadding1 = bp;
            SecondaryBond.recommendedDefaults[t].basePadding2 = bp;
          });
          this.props.app.drawingChangedNotByInteraction();
        }
      }
    }
  }
}
