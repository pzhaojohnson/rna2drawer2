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

function constrainNumberingOffset(no: number): number {
  if (!Number.isFinite(no)) {
    return 0;
  } else {
    return Math.floor(no);
  }
}

export class NumberingOffsetInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.sequence.numberingOffset.toString(),
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
      let no = Number.parseFloat(this.state.value);
      if (Number.isFinite(no)) {
        if (no != this.props.sequence.numberingOffset) {
          this.props.app.pushUndo();
          no = constrainNumberingOffset(no);
          this.props.sequence.numberingOffset = no;
          orientBaseNumberings(this.props.app.strictDrawing.drawing);
          this.props.app.refresh();
        }
      }
    }
  }
}
