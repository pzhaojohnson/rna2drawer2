import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';

export type Props = {
  app: App;
}

type State = {
  value: string;
}

export class DrawingTitleInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.app.drawingTitle,
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
    let title = this.state.value;
    title = title.trim();
    if (title.length == 0) {
      this.props.app.unspecifyDrawingTitle();
      this.props.app.refresh();
    } else {
      if (title != this.props.app.drawingTitle) {
        this.props.app.drawingTitle = title;
        this.props.app.refresh();
      }
    }
  }
}
