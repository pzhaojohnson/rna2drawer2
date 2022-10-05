import type { App } from 'App';

import type { Sequence } from 'Draw/sequences/Sequence';

import { numberingOffset as getNumberingOffset } from 'Draw/sequences/numberingOffset';
import { updateBaseNumberings } from 'Draw/sequences/updateBaseNumberings';
import { orientBaseNumberings } from 'Draw/bases/numberings/orient';

import * as React from 'react';

import { TextInput } from 'Forms/inputs/text/TextInput';

import { generateHTMLCompatibleUUID } from 'Utilities/generateHTMLCompatibleUUID';

import { isBlank } from 'Parse/isBlank';

class SequenceWrapper {
  /**
   * The wrapped sequence.
   */
  readonly sequence: Sequence;

  constructor(sequence: Sequence) {
    this.sequence = sequence;
  }

  get numberingOffset(): number | undefined {
    return getNumberingOffset(this.sequence);
  }

  set numberingOffset(numberingOffset: number | undefined) {
    if (numberingOffset == undefined) {
      return; // ignore undefined values
    }

    // only edit preexisting base numberings if possible
    if (this.sequence.bases.some(b => b.numbering)) {
      this.sequence.bases.forEach((b, i) => {
        let p = i + 1; // the position of the base in the sequence
        if (b.numbering) {
          b.numbering.text.text(`${p + numberingOffset}`);
        }
      });
    }

    // if there are no base numberings already present
    if (this.sequence.bases.every(b => !b.numbering)) {
      let offset = numberingOffset;
      let increment = 20; // default value

      // ensure that at least one base will be numbered
      let anchor = Math.min(increment, this.sequence.length);

      updateBaseNumberings(this.sequence, { offset, increment, anchor });
    }
  }
}

// keep stable to help with refocusing the input element on app refresh
const id = generateHTMLCompatibleUUID();

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The sequence to edit.
   */
  sequence: Sequence;
}

type State = {
  value: string;
}

export class NumberingOffsetInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    let sequence = new SequenceWrapper(props.sequence);

    this.state = {
      value: sequence.numberingOffset?.toString() ?? '',
    };
  }

  render() {
    return (
      <TextInput
        id={id}
        value={this.state.value}
        onChange={event => {
          this.setState({ value: event.target.value });
        }}
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
        style={{ width: `${Math.max(this.state.value.length, 8)}ch` }}
      />
    );
  }

  submit() {
    let sequence = new SequenceWrapper(this.props.sequence);

    if (isBlank(this.state.value)) {
      return;
    }
    let no = Number.parseFloat(this.state.value);
    if (!Number.isFinite(no)) {
      return;
    }
    no = Math.floor(no);
    if (no == sequence.numberingOffset) {
      return;
    }

    // update base numberings
    this.props.app.pushUndo();
    sequence.numberingOffset = no;
    orientBaseNumberings(this.props.app.strictDrawing.drawing);
    this.props.app.refresh();
  }
}
