import type { App } from 'App';
import type { Base } from 'Draw/bases/Base';

import * as SVG from '@svgdotjs/svg.js';
import { fillOpacity } from 'Forms/inputs/svg/fillOpacity/fillOpacity';
import { setFillOpacity } from 'Forms/inputs/svg/fillOpacity/fillOpacity';
import { proportionToDisplayablePercentageString as displayablePercentageString } from 'Forms/inputs/numbers/proportionToDisplayablePercentageString';
import { isBlank } from 'Parse/isBlank';
import { parsePercentageString } from 'Forms/inputs/numbers/parsePercentageString';

import * as React from 'react';
import textFieldStyles from 'Forms/inputs/text/TextField.css';

// returns the text elements of the bases
function texts(bases: Base[]): SVG.Text[] {
  return bases.map(base => base.text);
}

export type Props = {
  app: App;

  // the bases to edit
  bases: Base[];
}

export class FillOpacityInput extends React.Component<Props> {
  state: {
    value: string;
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: displayablePercentageString(fillOpacity(texts(props.bases)), { places: 0 }),
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
        style={{ width: '32px', textAlign: 'end' }}
      />
    );
  }

  submit() {
    if (isBlank(this.state.value)) {
      return;
    }

    let proportion = parsePercentageString(this.state.value);
    if (!Number.isFinite(proportion)) {
      return;
    } else if (proportion == fillOpacity(texts(this.props.bases))) {
      return;
    }

    this.props.app.pushUndo();
    setFillOpacity(texts(this.props.bases), proportion);
  }
}
