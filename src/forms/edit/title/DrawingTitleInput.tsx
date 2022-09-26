import type { App } from 'App';

import * as React from 'react';
import styles from './DrawingTitleInput.css';

import { generateHTMLCompatibleUUID } from 'Utilities/generateHTMLCompatibleUUID';

import { isBlank } from 'Parse/isBlank';

// keep stable to help with refocusing the input element on app refresh
const id = generateHTMLCompatibleUUID();

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
        id={id}
        className={styles.drawingTitleInput}
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
      this.props.app.drawingTitle.unspecify();
    } else if (value != this.props.app.drawingTitle.value) {
      this.props.app.drawingTitle.value = value;
    }
  }
}
