import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';
import { BaseNumberingInterface as BaseNumbering } from 'Draw/bases/number/BaseNumberingInterface';

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
      value: props.baseNumbering.text.wrapped.text(),
    };
  }

  render() {
    return (
      <input
        type='text'
        className={`${textFieldStyles.input}`}
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

    let currNumber = Number.parseFloat(this.props.baseNumbering.text.wrapped.text());
    if (n == currNumber) {
      return;
    }

    // update number
    this.props.app.pushUndo();
    this.props.baseNumbering.text.wrapped.text(n.toString());
    this.props.app.refresh();
  }
}