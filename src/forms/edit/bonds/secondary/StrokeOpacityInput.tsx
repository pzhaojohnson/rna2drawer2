import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import type { App } from 'App';
import { SecondaryBondInterface } from 'Draw/bonds/straight/SecondaryBondInterface';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { interpretNumber } from 'Draw/svg/interpretNumber';
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
// or if not all secondary bonds have the same stroke opacity
function currStrokeOpacityPercentage(secondaryBonds: SecondaryBondInterface[]): Value {
  let sops = new Set<number>();
  secondaryBonds.forEach(sb => {
    let so = sb.line.attr('stroke-opacity');
    let n = interpretNumber(so);
    if (n) {
      let sop = 100 * n.valueOf();
      sops.add(round(sop, 0));
    }
  });
  if (sops.size == 1) {
    return sops.values().next().value + '%';
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
      value: currStrokeOpacityPercentage(props.secondaryBonds),
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
        if (!areEqual(this.state.value, currStrokeOpacityPercentage(this.props.secondaryBonds))) {
          this.props.app.pushUndo();
          let so = sop / 100;
          so = constrainOpacity(so);
          so = round(so, 4);
          this.props.secondaryBonds.forEach(sb => {
            sb.line.attr({ 'stroke-opacity': so });
            SecondaryBond.recommendedDefaults[sb.type].line['stroke-opacity'] = so;
          });
          this.props.app.refresh();
        }
      }
    }
  }
}

export function AUTStrokeOpacityInput(props: Props) {
  return (
    <StrokeOpacityInput
      app={props.app}
      secondaryBonds={props.secondaryBonds.filter(sb => sb.type == 'AUT')}
    />
  );
}

export function GCStrokeOpacityInput(props: Props) {
  return (
    <StrokeOpacityInput
      app={props.app}
      secondaryBonds={props.secondaryBonds.filter(sb => sb.type == 'GC')}
    />
  );
}

export function GUTStrokeOpacityInput(props: Props) {
  return (
    <StrokeOpacityInput
      app={props.app}
      secondaryBonds={props.secondaryBonds.filter(sb => sb.type == 'GUT')}
    />
  );
}

export function OtherStrokeOpacityInput(props: Props) {
  return (
    <StrokeOpacityInput
      app={props.app}
      secondaryBonds={props.secondaryBonds.filter(sb => sb.type == 'other')}
    />
  );
}
