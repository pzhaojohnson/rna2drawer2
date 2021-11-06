import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';
import { SequenceInterface as Sequence } from 'Draw/sequences/SequenceInterface';
import { orientBaseNumberings } from 'Draw/bases/number/orient';

export type Props = {
  app: App;

  // the sequence to edit
  sequence: Sequence;
}

type Value = string;

type State = {
  value: Value;
}

function isBlank(v: Value): boolean {
  return v.trim().length == 0;
}

function constrainNumberingIncrement(ni: number): number {
  if (!Number.isFinite(ni)) {
    return 20;
  } else if (ni < 1) {
    return 1;
  } else {
    return Math.floor(ni);
  }
}

export class NumberingIncrementInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.sequence.numberingIncrement.toString(),
    };
  }

  render() {
    return (
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
    );
  }

  submit() {
    if (!isBlank(this.state.value)) {
      let ni = Number.parseFloat(this.state.value);
      if (Number.isFinite(ni)) {
        if (ni != this.props.sequence.numberingIncrement) {
          this.props.app.pushUndo();
          ni = constrainNumberingIncrement(ni);
          this.props.sequence.numberingIncrement = ni;
          orientBaseNumberings(this.props.app.strictDrawing.drawing);
          this.props.app.refresh();
        }
      }
    }
  }
}
