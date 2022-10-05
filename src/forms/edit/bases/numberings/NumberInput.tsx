import type { App } from 'App';

import type { BaseNumbering } from 'Draw/bases/numberings/BaseNumbering';

import * as React from 'react';

import { TextInput } from 'Forms/inputs/text/TextInput';

import { generateHTMLCompatibleUUID } from 'Utilities/generateHTMLCompatibleUUID';

// keep stable to help with refocusing the input element on app refresh
const id = generateHTMLCompatibleUUID();

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The base numberings to edit.
   */
  baseNumberings: BaseNumbering[];
}

type State = {
  value: string;
}

export class NumberInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: this.initialValue,
    };
  }

  get initialValue(): string {
    let texts = new Set(
      this.props.baseNumberings.map(bn => bn.text.text())
    );

    if (texts.size == 1) {
      return texts.values().next().value;
    } else {
      return '';
    }
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
        style={{
          width: `${Math.max(this.state.value.length, 5)}ch`,
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

    if (n == Number.parseFloat(this.initialValue)) {
      return;
    }

    // update number
    this.props.app.pushUndo();
    this.props.baseNumberings.forEach(bn => bn.text.text(n.toString()));
    this.props.app.refresh();
  }
}
