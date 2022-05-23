import * as React from 'react';
import { TextInputField } from 'Forms/inputs/text/TextInputField';
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
// or if not all tertiary bonds have the same base padding 2
function currBasePadding2(tertiaryBonds: TertiaryBond[]): Value {
  let bp2s = new Set<Value>();
  tertiaryBonds.forEach(tb => {
    let bp2 = round(tb.basePadding2, 0);
    bp2s.add(bp2.toString());
  });
  if (bp2s.size == 1) {
    return bp2s.values().next().value;
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

export class BasePadding2Field extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: currBasePadding2(props.tertiaryBonds),
    }
  }

  render() {
    return (
      <TextInputField
        label='Base Padding 2'
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
        input={{
          style: { width: '36px' },
        }}
        style={{ marginTop: '10px', alignSelf: 'start' }}
      />
    );
  }

  submit() {
    if (!isBlank(this.state.value)) {
      let bp2 = Number.parseFloat(this.state.value);
      if (Number.isFinite(bp2)) {
        if (!areEqual(this.state.value, currBasePadding2(this.props.tertiaryBonds))) {
          this.props.app.pushUndo();
          bp2 = constrainBasePadding(bp2);
          bp2 = round(bp2, 0);
          this.props.tertiaryBonds.forEach(tb => {
            tb.basePadding2 = bp2;
          });
          TertiaryBond.recommendedDefaults.basePadding2 = bp2;
          this.props.app.refresh();
        }
      }
    }
  }
}
