import * as React from 'react';
import textFieldStyles from 'Forms/inputs/text/TextField.css';
import type { App } from 'App';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { interpretNumber } from 'Draw/svg/interpretNumber';
import { round } from 'Math/round';

export type Props = {
  app: App;

  // the primary bonds to edit
  primaryBonds: PrimaryBond[];
}

type Value = string;

type State = {
  value: Value;
}

// returns an empty string value for an empty primary bonds array
// or if not all primary bonds have the same stroke opacity
function currStrokeOpacityPercentage(primaryBonds: PrimaryBond[]): Value {
  let sops = new Set<Value>();
  primaryBonds.forEach(pb => {
    let so = pb.line.attr('stroke-opacity');
    let n = interpretNumber(so);
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

export class StrokeOpacityInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: currStrokeOpacityPercentage(props.primaryBonds),
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
        if (!areEqual(this.state.value, currStrokeOpacityPercentage(this.props.primaryBonds))) {
          this.props.app.pushUndo();
          let so = sop / 100;
          so = constrainOpacity(so);
          so = round(so, 4);
          this.props.primaryBonds.forEach(pb => {
            pb.line.attr({ 'stroke-opacity': so });
          });
          PrimaryBond.recommendedDefaults.line['stroke-opacity'] = so;
          this.props.app.refresh();
        }
      }
    }
  }
}
