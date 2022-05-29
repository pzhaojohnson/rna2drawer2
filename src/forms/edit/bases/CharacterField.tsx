import type { App } from 'App';
import type { Base } from 'Draw/bases/Base';

import * as React from 'react';
import { TextInputField } from 'Forms/inputs/text/TextInputField';

export type Props = {
  app: App;

  // the bases to edit
  bases: Base[];
}

type State = {
  value: string;
}

export class CharacterField extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: this.initialValue,
    }
  }

  get initialValue(): string {
    let texts = new Set(
      this.props.bases.map(base => base.text.text())
    );

    if (texts.size == 1) {
      return texts.values().next().value;
    } else {
      return '';
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
    c = c.trim(); // remove leading and trailing whitespace

    if (c.length == 0) {
      return;
    } else if (c == this.initialValue) {
      return;
    }

    this.props.app.pushUndo();

    this.props.bases.forEach(base => {
      // remember center coordinates
      let bbox = base.text.bbox();
      let center = { x: bbox.cx, y: bbox.cy };

      // bases text should be a single character
      base.text.text(c.charAt(0));

      // recenter
      base.text.center(center.x, center.y);
    });
  }
}
