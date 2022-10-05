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

    let ni = deriveNumberingIncrement(props.sequence);

    this.state = {
      value: ni == undefined ? '' : ni.toString(),
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

    // ensure that at least the last base will be numbered
    // if the input numbering increment is greater than the sequence length
    let na = Math.min(ni, this.props.sequence.length);

    let firstNumberedPosition = this.props.sequence.bases.findIndex(b => b.numbering) + 1;
    if (firstNumberedPosition > 0) {
      // use the first numbered position as the numbering anchor
      // if there are base numberings already present
      na = firstNumberedPosition;
    }

    // update base numberings
    this.props.app.pushUndo();
    updateBaseNumberings(this.props.sequence, {
      offset: deriveNumberingOffset(this.props.sequence) ?? 0, // default to 0
      increment: ni,
      anchor: na,
    });
    orientBaseNumberings(this.props.app.strictDrawing.drawing);
    this.props.app.refresh();
  }
}
