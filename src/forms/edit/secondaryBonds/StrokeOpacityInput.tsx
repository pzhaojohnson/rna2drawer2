import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';
import { SecondaryBondInterface } from 'Draw/bonds/straight/SecondaryBondInterface';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { parseNumber } from 'Parse/svg/number';
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
    let n = parseNumber(so);
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

function valueIsValid(v: Value): boolean {
  let n = Number.parseFloat(v);
  return Number.isFinite(n);
}

function valuesAreEqual(v1: Value, v2: Value): boolean {
  return Number.parseFloat(v1) == Number.parseFloat(v2);
}

// converts values less than 0 to 0 and greater than 1 to 1
function clampOpacity(o: number): number {
  if (o < 0) {
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
          this.props.app.drawingChangedNotByInteraction();
        }}
        onKeyUp={event => {
          if (event.key.toLowerCase() == 'enter') {
            this.submit();
            this.props.app.drawingChangedNotByInteraction();
          }
        }}
        style={{ width: '32px', textAlign: 'end' }}
      />
    );
  }

  submit() {
    if (valueIsValid(this.state.value)) {
      if (!valuesAreEqual(this.state.value, currStrokeOpacityPercentage(this.props.secondaryBonds))) {
        this.props.app.pushUndo();
        let sop = Number.parseFloat(this.state.value);
        let so = sop / 100;
        so = clampOpacity(so);
        so = round(so, 4);
        this.props.secondaryBonds.forEach(sb => {
          sb.line.attr({ 'stroke-opacity': so });
          SecondaryBond.recommendedDefaults[sb.type].line['stroke-opacity'] = so;
        });
        this.props.app.drawingChangedNotByInteraction();
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
