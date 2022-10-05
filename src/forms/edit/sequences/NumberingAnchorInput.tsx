import type { App } from 'App';

import type { Sequence } from 'Draw/sequences/Sequence';

import { numberingOffset as deriveNumberingOffset } from 'Draw/sequences/numberingOffset';
import { numberingIncrement as deriveNumberingIncrement } from 'Draw/sequences/numberingIncrement';
import { numberingAnchor as deriveNumberingAnchor } from 'Draw/sequences/numberingAnchor';

import { updateBaseNumberings } from 'Draw/sequences/updateBaseNumberings';
import { orientBaseNumberings } from 'Draw/bases/numberings/orient';

import * as React from 'react';

import { TextInput } from 'Forms/inputs/text/TextInput';

import { generateHTMLCompatibleUUID } from 'Utilities/generateHTMLCompatibleUUID';

import { isNullish } from 'Values/isNullish';
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

  get numberingAnchor(): number | undefined {
    return deriveNumberingAnchor(this.sequence);
  }

  set numberingAnchor(numberingAnchor: number | undefined) {
    if (numberingAnchor == undefined) {
      return; // ignore undefined values
    }

    updateBaseNumberings(this.sequence, {
      offset: this.numberingOffset ?? 0,
      increment: this.numberingIncrement ?? 20, // default to 20
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

export class NumberingAnchorInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: this.initialValue,
    };
  }

  get initialValue(): string {
    let sequence = new SequenceWrapper(this.props.sequence);
    let numberingOffset = sequence.numberingOffset ?? 0;
    let numberingAnchor = sequence.numberingAnchor;

    if (isNullish(numberingAnchor)) {
      return '';
    } else {
      return `${numberingAnchor + numberingOffset}`;
    }
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
    let na = Number.parseFloat(this.state.value);
    if (!Number.isFinite(na)) {
      return;
    }
    na = Math.floor(na);
    let no = sequence.numberingOffset;
    if (no != undefined) {
      na -= no;
    }
    if (na == sequence.numberingAnchor) {
      return;
    }

    // update base numberings
    this.props.app.pushUndo();
    sequence.numberingAnchor = na;
    orientBaseNumberings(this.props.app.strictDrawing.drawing);
    this.props.app.refresh();
  }
}
