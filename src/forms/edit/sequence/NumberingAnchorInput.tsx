import * as React from 'react';
import { TextInput } from 'Forms/inputs/text/TextInput';
import type { App } from 'App';
import { SequenceInterface as Sequence } from 'Draw/sequences/SequenceInterface';
import { numberingOffset } from 'Draw/sequences/numberingOffset';
import { numberingIncrement } from 'Draw/sequences/numberingIncrement';
import { numberingAnchor } from 'Draw/sequences/numberingAnchor';
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

export class NumberingAnchorInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    let na = numberingAnchor(props.sequence);
    let no = numberingOffset(props.sequence);
    if (na != undefined && no != undefined) {
      na += no;
    }

    this.state = {
      value: na == undefined ? '' : na.toString(),
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
    let na = Number.parseFloat(this.state.value);
    if (!Number.isFinite(na)) {
      return;
    }
    na = Math.floor(na);
    let no = numberingOffset(this.props.sequence);
    if (no != undefined) {
      na -= no;
    }
    if (na == numberingAnchor(this.props.sequence)) {
      return;
    }

    // update base numberings
    this.props.app.pushUndo();
    updateBaseNumberings(this.props.sequence, {
      offset: numberingOffset(this.props.sequence) ?? 0, // default to 0
      increment: numberingIncrement(this.props.sequence) ?? 20, // default to 20
      anchor: na,
    });
    orientBaseNumberings(this.props.app.strictDrawing.drawing);
    this.props.app.refresh();
  }
}
