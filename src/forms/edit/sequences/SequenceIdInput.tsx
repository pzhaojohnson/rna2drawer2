import type { App } from 'App';

import type { Sequence } from 'Draw/sequences/Sequence';

import * as React from 'react';
import styles from './SequenceIdInput.css';

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

export class SequenceIdInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.sequence.id,
    };
  }

  render() {
    return (
      <input
        type='text'
        id={id}
        className={styles.sequenceIdInput}
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
      />
    );
  }

  submit() {
    let value = this.state.value;
    value = value.trim(); // remove leading and trailing whitespace

    if (isBlank(value)) {
      return;
    } else if (value == this.props.sequence.id) {
      return;
    }

    // set ID
    this.props.app.pushUndo();
    this.props.sequence.id = value;
  }
}
