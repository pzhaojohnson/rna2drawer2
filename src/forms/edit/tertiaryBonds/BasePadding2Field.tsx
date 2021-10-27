import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';
import { AppInterface as App } from 'AppInterface';
import { TertiaryBondInterface } from 'Draw/bonds/curved/TertiaryBondInterface';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
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
// or if not all tertiary bonds have the same base padding 2
function currBasePadding2(tertiaryBonds: TertiaryBondInterface[]): Value {
  let bp2s = new Set<number>();
  tertiaryBonds.forEach(tb => {
    bp2s.add(round(tb.basePadding2, 1));
  });
  if (bp2s.size == 1) {
    return bp2s.values().next().value.toString();
  } else {
    return '';
  }
}

function valueIsValid(v: Value): boolean {
  let n = Number.parseFloat(v);
  return Number.isFinite(n) && n >= 0;
}

function valueIsBlank(v: Value): boolean {
  return v.trim().length == 0;
}

function valuesAreEqual(v1: Value, v2: Value): boolean {
  return Number.parseFloat(v1) == Number.parseFloat(v2);
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
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
          <input
            type='text'
            className={textFieldStyles.input}
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
            onBlur={() => this.submit()}
            onKeyUp={event => {
              if (event.key.toLowerCase() == 'enter') {
                this.submit();
              }
            }}
            style={{ width: '36px' }}
          />
          <div style={{ marginLeft: '8px' }} >
            <p className={`${textFieldStyles.label} unselectable`} >
              Base Padding 2
            </p>
          </div>
        </div>
        {valueIsValid(this.state.value) || valueIsBlank(this.state.value) ? null : (
          <p
            key={Math.random()}
            className={`${errorMessageStyles.errorMessage} ${errorMessageStyles.fadesIn} unselectable`}
            style={{ marginTop: '3px' }}
          >
            Must be a nonnegative number.
          </p>
        )}
      </div>
    );
  }

  submit() {
    if (valueIsValid(this.state.value)) {
      if (!valuesAreEqual(this.state.value, currBasePadding2(this.props.tertiaryBonds))) {
        this.props.app.pushUndo();
        let bp2 = Number.parseFloat(this.state.value);
        this.props.tertiaryBonds.forEach(tb => {
          tb.basePadding2 = bp2;
        });
        TertiaryBond.recommendedDefaults.basePadding2 = bp2;
        this.props.app.drawingChangedNotByInteraction();
      }
    }
  }
}
