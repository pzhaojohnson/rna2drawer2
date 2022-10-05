import type { App } from 'App';

import type { Sequence } from 'Draw/sequences/Sequence';

import { numberingOffset as deriveNumberingOffset } from 'Draw/sequences/numberingOffset';
import { numberingIncrement as deriveNumberingIncrement } from 'Draw/sequences/numberingIncrement';

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
    return deriveNumberingOffset(this.sequence);
  }

  get numberingIncrement(): number | undefined {
    return deriveNumberingIncrement(this.sequence);
  }

  set numberingIncrement(numberingIncrement: number | undefined) {
    if (numberingIncrement == undefined) {
      return; // ignore undefined values
    }

    // use as the numbering anchor if possible
    let firstNumberedPosition = (
      this.sequence.bases.findIndex(b => b.numbering) + 1
    );

    let numberingAnchor = firstNumberedPosition >= 1 ? (
      firstNumberedPosition
    ) : numberingIncrement <= this.sequence.length ? (
      numberingIncrement
    ) : ( // if numbering increment is larger than the sequence length
      this.sequence.length
    );

    updateBaseNumberings(this.sequence, {
      offset: this.numberingOffset ?? 0,
      increment: numberingIncrement,
      anchor: numberingAnchor,
    });
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

export class NumberingIncrementInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    let sequence = new SequenceWrapper(props.sequence);

    this.state = {
      value: sequence.numberingIncrement?.toString() ?? '',
    };
  }

  render() {
    return (
      <TextInput
        id={id}
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
        style={{ width: `${Math.max(this.state.value.length, 8)}ch` }}
      />
    );
  }

  submit() {
    let sequence = new SequenceWrapper(this.props.sequence);

    if (isBlank(this.state.value)) {
      return;
    }
    let ni = Number.parseFloat(this.state.value);
    if (!Number.isFinite(ni)) {
      return;
    }
    ni = Math.floor(ni);
    if (ni == 0) {
      return;
    } else if (ni < 0) {
      // convert negatives to positives
      ni *= -1;
    }
    if (ni == deriveNumberingIncrement(this.props.sequence)) {
      return;
    }

    // update base numberings
    this.props.app.pushUndo();
    sequence.numberingIncrement = ni;
    orientBaseNumberings(this.props.app.strictDrawing.drawing);
    this.props.app.refresh();
  }
}
