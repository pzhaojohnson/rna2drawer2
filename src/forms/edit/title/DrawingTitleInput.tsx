import type { App } from 'App';

import * as React from 'react';
import textFieldStyles from 'Forms/inputs/text/TextField.css';

import { isBlank } from 'Parse/isBlank';

export type Props = {
  app: App; // a reference to the whole app
}

type State = {
  value: string;
}

export class DrawingTitleInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.app.drawingTitle.value,
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
    let value = this.state.value;
    value = value.trim();
    if (isBlank(value)) {
      this.props.app.drawingTitle.unspecify();
    } else {
      if (value != this.props.app.drawingTitle.value) {
        this.props.app.drawingTitle.value = value;
      }
    }
  }
}
