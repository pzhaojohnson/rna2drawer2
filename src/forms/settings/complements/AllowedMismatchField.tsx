import type { App } from 'App';
import type { BindingTool } from 'Draw/interact/bind/BindingTool';

import * as React from 'react';
import { TextInputField } from 'Forms/inputs/text/TextInputField';

import { round } from 'Math/round';
import { isBlank } from 'Parse/isBlank';

class BindingToolWrapper {
  readonly bindingTool: BindingTool;

  constructor(bindingTool: BindingTool) {
    this.bindingTool = bindingTool;
  }

  /**
   * The allowed mismatch complements option of the binding tool.
   * (Converts an undefined value to a value of zero.)
   */
  get allowedMismatch(): number {
    return this.bindingTool.complementsOptions.allowedMismatch ?? 0;
  }

  set allowedMismatch(proportion: number) {
    this.bindingTool.complementsOptions.allowedMismatch = proportion;
  }
}

class AppWrapper {
  readonly app: App;

  constructor(app: App) {
    this.app = app;
  }

  /**
   * The binding tool of the app.
   */
  get bindingTool(): BindingToolWrapper {
    return new BindingToolWrapper(this.app.drawingInteraction.bindingTool);
  }

  refresh() {
    this.app.refresh();
  }
}

export type Props = {
  app: App;
}

type State = {
  value: string; // a percentage string
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
    let app = new AppWrapper(this.props.app);

    let proportion = app.bindingTool.allowedMismatch;
    let percentage = 100 * proportion;
    percentage = round(percentage, 0);

    return percentage + '%';
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
    let app = new AppWrapper(this.props.app);

    if (isBlank(this.state.value)) {
      return;
    }

    let amp = Number.parseFloat(this.state.value);
    if (!Number.isFinite(amp)) {
      return;
    }

    let am = amp / 100;

    if (am == app.bindingTool.allowedMismatch) {
      return;
    }

    // clamp value
    if (am < 0) {
      am = 0;
    } else if (am > 1) {
      am = 1;
    }

    am = round(am, 2);

    // set value
    app.bindingTool.allowedMismatch = am;
    app.refresh();
  }
}
