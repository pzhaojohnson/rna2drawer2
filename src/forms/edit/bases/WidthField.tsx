import * as React from 'react';
import { TextInputField } from 'Forms/inputs/text/TextInputField';
import type { App } from 'App';
import { round } from 'Math/round';

export type Props = {
  app: App;
}

type Value = string;

type State = {
  value: Value;
}

function isBlank(v: Value): boolean {
  return v.trim().length == 0;
}

function constrainWidth(w: number): number {
  if (!Number.isFinite(w)) {
    return 13.5;
  } else if (w < 0) {
    return 0;
  } else {
    return w;
  }
}

export class WidthField extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.app.strictDrawing.baseWidth.toString(),
    }
  }

  render() {
    return (
      <TextInputField
        label='Width'
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
        input={{
          style: { width: '32px' },
        }}
        style={{ alignSelf: 'start' }}
      />
    );
  }

  submit() {
    if (!isBlank(this.state.value)) {
      let w = Number.parseFloat(this.state.value);
      if (Number.isFinite(w)) {
        if (w != this.props.app.strictDrawing.baseWidth) {
          this.props.app.pushUndo();
          w = constrainWidth(w);
          w = round(w, 2);
          this.props.app.strictDrawing.baseWidth = w;
          this.props.app.strictDrawing.updateLayout();
          this.props.app.refresh();
        }
      }
    }
  }
}
