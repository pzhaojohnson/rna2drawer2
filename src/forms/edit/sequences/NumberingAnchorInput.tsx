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

import { isBlank } from 'Parse/isBlank';

// keep stable to help with refocusing the input element on app refresh
const id = generateHTMLCompatibleUUID();

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

    let na = deriveNumberingAnchor(props.sequence);
    let no = deriveNumberingOffset(props.sequence);
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
    let na = Number.parseFloat(this.state.value);
    if (!Number.isFinite(na)) {
      return;
    }
    na = Math.floor(na);
    let no = deriveNumberingOffset(this.props.sequence);
    if (no != undefined) {
      na -= no;
    }
    if (na == deriveNumberingAnchor(this.props.sequence)) {
      return;
    }

    // update base numberings
    this.props.app.pushUndo();
    updateBaseNumberings(this.props.sequence, {
      offset: deriveNumberingOffset(this.props.sequence) ?? 0, // default to 0
      increment: deriveNumberingIncrement(this.props.sequence) ?? 20, // default to 20
      anchor: na,
    });
    orientBaseNumberings(this.props.app.strictDrawing.drawing);
    this.props.app.refresh();
  }
}
