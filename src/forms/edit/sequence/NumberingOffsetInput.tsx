import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';
import { SequenceInterface as Sequence } from 'Draw/sequences/SequenceInterface';
import { areUnnumbered } from 'Draw/bases/number/areUnnumbered';
import { numberingOffset } from 'Draw/sequences/numberingOffset';
import { updateBaseNumberings } from 'Draw/sequences/updateBaseNumberings';
import { orientBaseNumberings } from 'Draw/bases/number/orient';
import { isBlank } from 'Parse/isBlank';

export type Props = {
  app: App;

  // the sequence to edit
  sequence: Sequence;
}

type Value = string;

type State = {
  value: Value;
}

export class NumberingOffsetInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    let no = numberingOffset(props.sequence);

    this.state = {
      value: no == undefined ? '' : no.toString(),
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
        style={{ width: '48px' }}
      />
    );
  }

  submit() {
    if (isBlank(this.state.value)) {
      return;
    }
    let no = Number.parseFloat(this.state.value);
    if (!Number.isFinite(no)) {
      return;
    }
    no = Math.floor(no);
    if (no == numberingOffset(this.props.sequence)) {
      return;
    }

    // update base numberings
    this.props.app.pushUndo();
    if (areUnnumbered(this.props.sequence.bases)) {
      updateBaseNumberings(this.props.sequence, { offset: no, increment: 20, anchor: 0 });
    } else {
      this.props.sequence.bases.forEach((b, i) => {
        let p = i + 1;
        let n = p + no;
        if (b.numbering) {
          b.numbering.text.wrapped.text(n.toString());
        }
      });
    }
    orientBaseNumberings(this.props.app.strictDrawing.drawing);
    this.props.app.refresh();
  }
}
