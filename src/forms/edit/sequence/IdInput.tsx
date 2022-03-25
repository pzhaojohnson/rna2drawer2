import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import type { App } from 'App';
import { SequenceInterface as Sequence } from 'Draw/sequences/SequenceInterface';

export type Props = {
  app: App;

  // the sequence to edit
  sequence: Sequence;
}

type State = {
  value: string;
}

export class IdInput extends React.Component<Props> {
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
        style={{ padding: '4px 8px' }}
      />
    );
  }

  submit() {
    let id = this.state.value;
    id = id.trim();
    if (id.length == 0) {
      return;
    }
    if (id == this.props.sequence.id) {
      return;
    }

    // set ID
    this.props.app.pushUndo();
    this.props.sequence.id = id;
    this.props.app.refresh();
  }
}
