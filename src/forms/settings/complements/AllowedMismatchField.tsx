import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';
import { FoldingModeInterface as FoldingMode } from 'Draw/interact/fold/FoldingModeInterface';
import { round } from 'Math/round';
import { isBlank } from 'Parse/isBlank';

export type Props = {
  app: App;
}

// a percentage
type Value = string;

type State = {
  value: Value;
}

function allowedMismatchPercentage(foldingMode: FoldingMode): Value {
  let am = foldingMode.allowedMismatch;
  let amp = 100 * am;
  amp = round(amp, 0);
  return amp + '%';
}

function areEqual(v1: Value, v2: Value): boolean {
  return Number.parseFloat(v1) == Number.parseFloat(v2);
}

export class AllowedMismatchField extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    let foldingMode = props.app.strictDrawingInteraction.foldingMode;

    this.state = {
      value: allowedMismatchPercentage(foldingMode),
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
            Mismatch Allowed
          </p>
        </div>
      </div>
    );
  }

  submit() {
    if (isBlank(this.state.value)) {
      return;
    }

    let foldingMode = this.props.app.strictDrawingInteraction.foldingMode;
    if (areEqual(this.state.value, allowedMismatchPercentage(foldingMode))) {
      return;
    }

    let amp = Number.parseFloat(this.state.value);
    if (!Number.isFinite(amp)) {
      return;
    }

    let am = amp / 100;

    // clamp value
    if (am < 0) {
      am = 0;
    } else if (am > 1) {
      am = 1;
    }

    am = round(am, 2);

    // set value
    foldingMode.allowedMismatch = am;
    this.props.app.refresh();
  }
}
