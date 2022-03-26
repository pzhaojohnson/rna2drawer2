import * as React from 'react';
import textFieldStyles from 'Forms/inputs/text/TextField.css';
import type { App } from 'App';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { secondaryBondTypes } from 'Draw/bonds/straight/SecondaryBond';
import { interpretNumber } from 'Draw/svg/interpretNumber';
import { round } from 'Math/round';

export type Props = {
  app: App;

  // the secondary bonds to edit
  secondaryBonds: SecondaryBond[];
}

type Value = string;

type State = {
  value: Value;
}

// returns an empty string value for an empty secondary bonds array
// or if not all secondary bonds have the same stroke width
function currStrokeWidth(secondaryBonds: SecondaryBond[]): Value {
  let sws = new Set<Value>();
  secondaryBonds.forEach(sb => {
    let sw = sb.line.attr('stroke-width');
    let n = interpretNumber(sw);
    if (n) {
      let pxs = n.convert('px').valueOf();
      pxs = round(pxs, 2);
      sws.add(pxs.toString());
    }
  });
  if (sws.size == 1) {
    return sws.values().next().value;
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

function constrainStrokeWidth(sw: number): number {
  if (!Number.isFinite(sw)) {
    return 1;
  } else if (sw < 0) {
    return 0;
  } else {
    return sw;
  }
}

export class StrokeWidthField extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: currStrokeWidth(props.secondaryBonds),
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
          Line Width
        </p>
      </div>
    );
  }

  submit() {
    if (!isBlank(this.state.value)) {
      let sw = Number.parseFloat(this.state.value);
      if (Number.isFinite(sw)) {
        if (!areEqual(this.state.value, currStrokeWidth(this.props.secondaryBonds))) {
          this.props.app.pushUndo();
          sw = constrainStrokeWidth(sw);
          sw = round(sw, 2);
          this.props.secondaryBonds.forEach(sb => {
            sb.line.attr({ 'stroke-width': sw });
          });
          secondaryBondTypes.forEach(t => {
            SecondaryBond.recommendedDefaults[t].line['stroke-width'] = sw;
          });
          this.props.app.refresh();
        }
      }
    }
  }
}
