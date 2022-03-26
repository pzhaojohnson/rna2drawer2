import * as React from 'react';
import textFieldStyles from 'Forms/inputs/text/TextField.css';
import type { App } from 'App';
import type { BindingTool } from 'Draw/interact/bind/BindingTool';
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

function allowedMismatchPercentage(bindingTool: BindingTool): Value {
  let am = bindingTool.complementsOptions.allowedMismatch ?? 0;
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

    let bindingTool = props.app.strictDrawingInteraction.bindingTool;

    this.state = {
      value: allowedMismatchPercentage(bindingTool),
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

    let bindingTool = this.props.app.strictDrawingInteraction.bindingTool;
    if (areEqual(this.state.value, allowedMismatchPercentage(bindingTool))) {
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
    bindingTool.complementsOptions.allowedMismatch = am;
    this.props.app.refresh();
  }
}
