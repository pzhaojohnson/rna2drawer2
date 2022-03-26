import * as React from 'react';
import textFieldStyles from 'Forms/inputs/text/TextField.css';
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

function constrainTerminiGap(tg: number): number {
  if (!Number.isFinite(tg)) {
    return 0;
  } else if (tg < 0) {
    return 0;
  } else {
    return tg;
  }
}

export class TerminiGapField extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    let generalLayoutProps = props.app.strictDrawing.generalLayoutProps;
    let tg = generalLayoutProps.terminiGap;
    tg = round(tg, 2);
    this.state = {
      value: tg.toString(),
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
        <p
          className={`${textFieldStyles.label} unselectable`}
          style={{ marginLeft: '8px' }}
        >
          Termini Gap
        </p>
      </div>
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
