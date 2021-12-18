import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';
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

export class NumberingIncrementInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    let ni = numberingIncrement(props.sequence);

    this.state = {
      value: ni == undefined ? '' : ni.toString(),
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
    if (ni == numberingIncrement(this.props.sequence)) {
      return;
    }

    // update base numberings
    this.props.app.pushUndo();
    updateBaseNumberings(this.props.sequence, {
      offset: numberingOffset(this.props.sequence) ?? 0, // default to 0
      increment: ni,
      anchor: numberingAnchor(this.props.sequence) ?? 0, // default to 0
    });
    orientBaseNumberings(this.props.app.strictDrawing.drawing);
    this.props.app.refresh();
  }
}
