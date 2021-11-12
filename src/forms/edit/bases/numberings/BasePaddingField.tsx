import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';
import { BaseNumberingInterface } from 'Draw/bases/number/BaseNumberingInterface';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import { round } from 'Math/round';

export type Props = {
  app: App;

  // the base numberings to edit
  baseNumberings: BaseNumberingInterface[];
}

type Value = string;

type State = {
  value: Value;
}

// returns an empty string value for an empty base numberings array
// or if not all base numberings have the same base padding
function currBasePadding(baseNumberings: BaseNumberingInterface[]): Value {
  let bps = new Set<Value>();
  baseNumberings.forEach(bn => {
    let bp = bn.basePadding;
    if (typeof bp == 'number') {
      bp = round(bp, 0);
      bps.add(bp.toString());
    }
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
    return 8;
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
      value: currBasePadding(props.baseNumberings),
    };
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
        <div style={{ marginLeft: '8px' }} >
          <p className={`${textFieldStyles.label} unselectable`} >
            Base Padding
          </p>
        </div>
      </div>
    );
  }

  submit() {
    if (!isBlank(this.state.value)) {
      if (!areEqual(this.state.value, currBasePadding(this.props.baseNumberings))) {
        let bp = Number.parseFloat(this.state.value);
        if (Number.isFinite(bp)) {
          this.props.app.pushUndo();
          bp = constrainBasePadding(bp);
          bp = round(bp, 0);
          this.props.baseNumberings.forEach(bn => {
            bn.basePadding = bp;
          });
          BaseNumbering.recommendedDefaults.basePadding = bp;
          this.props.app.refresh();
        }
      }
    }
  }
}