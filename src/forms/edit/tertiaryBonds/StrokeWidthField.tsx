import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';
import { TertiaryBondInterface } from 'Draw/bonds/curved/TertiaryBondInterface';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
import { parseNumber } from 'Parse/svg/number';
import { round } from 'Math/round';

export type Props = {
  app: App;

  // the tertiary bonds to edit
  tertiaryBonds: TertiaryBondInterface[];
}

type Value = string;

type State = {
  value: Value;
}

// returns an empty string value for an empty tertiary bonds array
// or if not all tertiary bonds have the same stroke width
function currStrokeWidth(tertiaryBonds: TertiaryBondInterface[]): Value {
  let sws = new Set<Value>();
  tertiaryBonds.forEach(tb => {
    let sw = tb.path.attr('stroke-width');
    let n = parseNumber(sw);
    if (n) {
      let pxs = n.convert('px').valueOf();
      sws.add(round(pxs, 2).toString());
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
      value: currStrokeWidth(props.tertiaryBonds),
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
            this.props.app.drawingChangedNotByInteraction();
          }}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              this.submit();
              this.props.app.drawingChangedNotByInteraction();
            }
          }}
          style={{ width: '36px' }}
        />
        <div style={{ marginLeft: '8px' }} >
          <p className={`${textFieldStyles.label} unselectable`} >
            Line Width
          </p>
        </div>
      </div>
    );
  }

  submit() {
    if (!isBlank(this.state.value)) {
      if (!areEqual(this.state.value, currStrokeWidth(this.props.tertiaryBonds))) {
        this.props.app.pushUndo();
        let sw = Number.parseFloat(this.state.value);
        sw = constrainStrokeWidth(sw);
        this.props.tertiaryBonds.forEach(tb => {
          tb.path.attr({ 'stroke-width': sw });
        });
        TertiaryBond.recommendedDefaults.path['stroke-width'] = sw;
        this.props.app.drawingChangedNotByInteraction();
      }
    }
  }
}
