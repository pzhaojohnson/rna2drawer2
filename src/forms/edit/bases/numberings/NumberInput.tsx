import type { App } from 'App';
import type { BaseNumbering } from 'Draw/bases/number/BaseNumbering';

import * as React from 'react';
import { TextInput } from 'Forms/inputs/text/TextInput';

export type Props = {
  app: App;

  // the base numbering to edit
  baseNumbering: BaseNumbering;
}

type State = {
  value: string;
}

export class NumberInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.baseNumbering.text.text(),
    };
  }

  render() {
    return (
      <TextInput
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
        style={{
          width: `${Math.max(this.state.value.length, 4)}ch`,
        }}
      />
    );
  }

  submit() {
    let n = Number.parseFloat(this.state.value);

    if (!Number.isFinite(n)) {
      return;
    }

    n = Math.floor(n); // make an integer

    let currNumber = Number.parseFloat(this.props.baseNumbering.text.text());
    if (n == currNumber) {
      return;
    }

    // update number
    this.props.app.pushUndo();
    this.props.baseNumbering.text.text(n.toString());
    this.props.app.refresh();
  }
}
