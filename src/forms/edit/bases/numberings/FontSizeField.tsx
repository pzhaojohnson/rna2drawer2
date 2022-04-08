import type { App } from 'App';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';

import * as SVG from '@svgdotjs/svg.js';
import { fontSize } from 'Forms/inputs/svg/fontSize/fontSize';
import { setFontSize } from 'Forms/inputs/svg/fontSize/fontSize';
import { numberToDisplayableString as displayableString } from 'Forms/inputs/numbers/numberToDisplayableString';
import { isBlank } from 'Parse/isBlank';

import * as React from 'react';
import textFieldStyles from 'Forms/inputs/text/TextField.css';

// returns the text elements of the base numberings
function texts(baseNumberings: BaseNumbering[]): SVG.Text[] {
  return baseNumberings.map(bn => bn.text);
}

export type Props = {
  app: App;

  // the base numberings to edit
  baseNumberings: BaseNumbering[];
}

export class FontSizeField extends React.Component<Props> {
  state: {
    value: string;
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: displayableString(fontSize(texts(props.baseNumberings)), { places: 1 }),
    };
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
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
          style={{ width: '32px' }}
        />
        <div style={{ marginLeft: '8px' }} >
          <p className={`${textFieldStyles.label} unselectable`} >
            Font Size
          </p>
        </div>
      </div>
    );
  }

  submit() {
    if (isBlank(this.state.value)) {
      return;
    }

    let n = Number.parseFloat(this.state.value);
    if (!Number.isFinite(n)) {
      return;
    } else if (n == fontSize(texts(this.props.baseNumberings))) {
      return;
    }

    this.props.app.pushUndo();
    setFontSize(texts(this.props.baseNumberings), n);
    this.props.baseNumberings.forEach(bn => bn.reposition());
    BaseNumbering.recommendedDefaults.text['font-size'] = n;
  }
}
