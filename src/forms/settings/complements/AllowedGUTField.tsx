import { AppInterface as App } from 'AppInterface';
import type { BindingTool } from 'Draw/interact/bind/BindingTool';

import * as React from 'react';
import { Checkbox } from 'Forms/fields/checkbox/Checkbox';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { round } from 'Math/round';
import { isBlank } from 'Parse/isBlank';

// returns the binding tool of the app
function bindingTool(app: App): BindingTool {
  return app.strictDrawingInteraction.bindingTool;
}

// returns the numeric value of the complements option
// (converts values of undefined to zero)
function allowedGUT(tool: BindingTool): number {
  return tool.complementsOptions.allowedGUT ?? 0;
}

export type Props = {

  // a reference to the whole app
  app: App;
}

export class AllowedGUTField extends React.Component<Props> {
  state: {
    value: string;
  };

  constructor(props: Props) {
    super(props);

    let app = props.app;

    let percentage = 100 * allowedGUT(bindingTool(app));
    percentage = round(percentage, 0);

    this.state = {
      value: percentage + '%',
    };
  }

  render() {
    let app = this.props.app;

    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <Checkbox
          checked={allowedGUT(bindingTool(app)) > 0}
          onChange={event => {
            bindingTool(app).complementsOptions.allowedGUT = event.target.checked ? 1 : 0;
            app.refresh();
          }}
        />
        {allowedGUT(bindingTool(app)) <= 0 ? null : (
          <input
            type='text'
            className={textFieldStyles.input}
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
            onBlur={() => {
              this.submit();
              app.refresh();
            }}
            onKeyUp={event => {
              if (event.key.toLowerCase() == 'enter') {
                this.submit();
                app.refresh();
              }
            }}
            style={{ marginLeft: '8px', width: '32px' }}
          />
        )}
        <div style={{ width: allowedGUT(bindingTool(app)) <= 0 ? '6px' : '8px' }} />
        <p className={`${textFieldStyles.label} unselectable`} >
          {allowedGUT(bindingTool(app)) <= 0 ? 'Include GU and GT Pairs' : 'GU and GT Pairs Allowed'}
        </p>
      </div>
    );
  }

  submit() {
    let app = this.props.app;

    if (isBlank(this.state.value)) {
      return;
    }

    let percentage = Number.parseFloat(this.state.value);
    if (!Number.isFinite(percentage)) {
      return;
    }

    let proportion = percentage / 100;

    if (proportion == allowedGUT(bindingTool(app))) {
      return;
    }

    proportion = round(proportion, 2);

    // clamp value
    if (proportion < 0) {
      proportion = 0;
    } else if (proportion > 1) {
      proportion = 1;
    }

    // set option
    bindingTool(app).complementsOptions.allowedGUT = proportion;
  }
}
