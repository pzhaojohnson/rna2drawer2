import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';
import { PrimaryBondInterface } from 'Draw/bonds/straight/PrimaryBondInterface';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { parseNumber } from 'Parse/svg/number';
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
// or if not all primary bonds have the same stroke width
function currStrokeWidth(primaryBonds: PrimaryBondInterface[]): Value {
  let sws = new Set<Value>();
  primaryBonds.forEach(pb => {
    let sw = pb.line.attr('stroke-width');
    let n = parseNumber(sw);
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
      value: currStrokeWidth(props.primaryBonds),
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
          Line Width
        </p>
      </div>
    );
  }

  submit() {
    if (!isBlank(this.state.value)) {
      let sw = Number.parseFloat(this.state.value);
      if (Number.isFinite(sw)) {
        if (!areEqual(this.state.value, currStrokeWidth(this.props.primaryBonds))) {
          this.props.app.pushUndo();
          sw = constrainStrokeWidth(sw);
          sw = round(sw, 2);
          this.props.primaryBonds.forEach(pb => {
            pb.line.attr({ 'stroke-width': sw });
          });
          PrimaryBond.recommendedDefaults.line['stroke-width'] = sw;
          this.props.app.drawingChangedNotByInteraction();
        }
      }
    }
  }
}
