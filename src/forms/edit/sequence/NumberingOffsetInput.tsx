import * as React from 'react';
import { TextInput } from 'Forms/inputs/text/TextInput';
import type { App } from 'App';
import { SequenceInterface as Sequence } from 'Draw/sequences/SequenceInterface';
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
      <TextInput
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
        style={{ width: '8ch' }}
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
    let updated = false;
    this.props.sequence.bases.forEach((b, i) => {
      let p = i + 1;
      let n = p + no;
      if (b.numbering) {
        b.numbering.text.text(n.toString());
        updated = true;
      }
    });
    if (!updated) { // there are no base numberings already present
      let ni = 20; // a good default
      // ensures that at least one base will be numbered for a nonempty sequence
      let na = Math.min(ni, this.props.sequence.length);
      let sequenceNumbering = { offset: no, increment: ni, anchor: na };
      updateBaseNumberings(this.props.sequence, sequenceNumbering);
    }
    orientBaseNumberings(this.props.app.strictDrawing.drawing);
    this.props.app.refresh();
  }
}
