import type { App } from 'App';
import type { BindingTool } from 'Draw/interact/bind/BindingTool';

import * as React from 'react';
import { TextInputField } from 'Forms/inputs/text/TextInputField';

import { round } from 'Math/round';
import { isBlank } from 'Parse/isBlank';

export type Props = {
  app: App;
}

type State = {
  value: string; // a percentage string
}

function allowedMismatchPercentage(bindingTool: BindingTool): string {
  let am = bindingTool.complementsOptions.allowedMismatch ?? 0;
  let amp = 100 * am;
  amp = round(amp, 0);
  return amp + '%';
}

function areEqual(v1: string, v2: string): boolean {
  return Number.parseFloat(v1) == Number.parseFloat(v2);
}

export class AllowedMismatchField extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: this.initialValue,
    };
  }

  get initialValue(): string {
    return allowedMismatchPercentage(this.props.app.drawingInteraction.bindingTool);
  }

  render() {
    return (
      <TextInputField
        label='Mismatch Allowed'
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
        input={{ style: { width: '32px' } }}
        style={{ alignSelf: 'start' }}
      />
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
