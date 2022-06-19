import type { App } from 'App';
import type { BindingTool } from 'Draw/interact/bind/BindingTool';

import * as React from 'react';
import { TextInput } from 'Forms/inputs/text/TextInput';
import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';
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
        <input
          type='checkbox'
          id='AllowedGUTCheckbox'
          checked={allowedGUT(bindingTool(app)) > 0}
          onChange={event => {
            bindingTool(app).complementsOptions.allowedGUT = event.target.checked ? 1 : 0;
            app.refresh();
          }}
        />
        {allowedGUT(bindingTool(app)) <= 0 ? null : (
          <TextInput
            id='AllowedGUTPercentageInput'
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
        <FieldLabel
          htmlFor={allowedGUT(bindingTool(app)) <= 0 ? 'AllowedGUTCheckbox' : 'AllowedGUTPercentageInput' }
          style={{
            paddingLeft: allowedGUT(bindingTool(app)) <= 0 ? '6px' : '8px',
            cursor: allowedGUT(bindingTool(app)) <= 0 ? 'pointer' : 'text',
          }}
        >
          {allowedGUT(bindingTool(app)) <= 0 ? 'Include GU and GT Pairs' : 'GU and GT Pairs Allowed'}
        </FieldLabel>
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
