import type { App } from 'App';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';

import * as SVG from '@svgdotjs/svg.js';
import { fontSize } from 'Forms/inputs/svg/fontSize/fontSize';
import { setFontSize } from 'Forms/inputs/svg/fontSize/fontSize';
import { numberToDisplayableString as displayableString } from 'Forms/inputs/numbers/numberToDisplayableString';
import { isBlank } from 'Parse/isBlank';

import * as React from 'react';
import { TextInputField } from 'Forms/inputs/text/TextInputField';

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
      <TextInputField
        label='Font Size'
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
          style: { width: '32px' },
        }}
        style={{ marginTop: '8px', alignSelf: 'start' }}
      />
    );
  }

  submit() {
    if (isBlank(this.state.value)) {
      return;
    }

    let value = Number.parseFloat(this.state.value);
    if (!Number.isFinite(value)) {
      return;
    } else if (value == fontSize(texts(this.props.baseNumberings))) {
      return;
    }

    this.props.app.pushUndo();
    setFontSize(texts(this.props.baseNumberings), value);
    this.props.baseNumberings.forEach(bn => bn.reposition());

    // may be different from the value that was specified
    let constrainedValue = fontSize(texts(this.props.baseNumberings));

    BaseNumbering.recommendedDefaults.text['font-size'] = (
      constrainedValue
      ?? BaseNumbering.recommendedDefaults.text['font-size']
    );
  }
}
