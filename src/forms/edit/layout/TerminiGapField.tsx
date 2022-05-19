import type { App } from 'App';

import * as React from 'react';
import { TextInputField } from 'Forms/inputs/text/TextInputField';

import { round } from 'Math/round';
import { isBlank } from 'Parse/isBlank';

export type Props = {
  app: App; // a reference to the whole app
}

type State = {
  value: string;
}

function constrainTerminiGap(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  } else if (value < 0) {
    return 0;
  } else {
    return value;
  }
}

export class TerminiGapField extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    let generalLayoutProps = props.app.strictDrawing.generalLayoutProps;
    let terminiGap = generalLayoutProps.terminiGap;
    terminiGap = round(terminiGap, 2);

    this.state = {
      value: terminiGap.toString(),
    };
  }

  render() {
    return (
      <TextInputField
        label='Termini Gap'
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
          style: { width: '6ch' },
        }}
        style={{ alignSelf: 'start' }}
      />
    );
  }

  submit() {
    if (!isBlank(this.state.value)) {
      let tg = Number.parseFloat(this.state.value);
      if (Number.isFinite(tg)) {
        let generalLayoutProps = this.props.app.strictDrawing.generalLayoutProps;
        if (tg != generalLayoutProps.terminiGap) {
          this.props.app.pushUndo();
          tg = constrainTerminiGap(tg);
          tg = round(tg, 2);
          generalLayoutProps.terminiGap = tg;
          this.props.app.strictDrawing.updateLayout();
          this.props.app.refresh();
        }
      }
    }
  }
}
