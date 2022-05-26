import * as React from 'react';
import { TextInputField } from 'Forms/inputs/text/TextInputField';
import type { App } from 'App';
import type { Base } from 'Draw/bases/Base';

export type Props = {
  app: App;

  // the base to edit
  base: Base;
}

type State = {
  value: string;
}

export class CharacterField extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.base.text.text(),
    }
  }

  render() {
    return (
      <TextInputField
        label='Character'
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
        input={{
          style: { width: '12px', textAlign: 'center' },
        }}
        style={{ marginBottom: '12px', alignSelf: 'start' }}
      />
    );
  }

  submit() {
    let c = this.state.value;
    c = c.trim();
    if (c.length > 0) {
      if (c != this.props.base.text.text()) {
        this.props.app.pushUndo();

        // remember center coordinates
        let bbox = this.props.base.text.bbox();
        let center = { x: bbox.cx, y: bbox.cy };

        // ignore characters beyond the first input character
        this.props.base.text.text(c.charAt(0));

        // recenter
        this.props.base.text.center(center.x, center.y);

        this.props.app.refresh();
      }
    }
  }
}
