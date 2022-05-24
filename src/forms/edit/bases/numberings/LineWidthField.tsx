import type { App } from 'App';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';

import * as SVG from '@svgdotjs/svg.js';
import { strokeWidth } from 'Forms/inputs/svg/strokeWidth/strokeWidth';
import { setStrokeWidth } from 'Forms/inputs/svg/strokeWidth/strokeWidth';
import { numberToDisplayableString as displayableString } from 'Forms/inputs/numbers/numberToDisplayableString';
import { isBlank } from 'Parse/isBlank';

import * as React from 'react';
import { TextInputField } from 'Forms/inputs/text/TextInputField';

// returns the line elements of the base numberings
function lines(baseNumberings: BaseNumbering[]): SVG.Line[] {
  return baseNumberings.map(bn => bn.line);
}

export type Props = {

  // a reference to the whole app
  app: App;

  // the base numberings to edit
  baseNumberings: BaseNumbering[];
}

export class LineWidthField extends React.Component<Props> {
  state: {
    value: string;
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: displayableString(strokeWidth(lines(props.baseNumberings)), { places: 2 }),
    };
  }

  render() {
    return (
      <TextInputField
        label='Line Width'
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
        style={{ marginTop: '16px', alignSelf: 'start' }}
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
    } else if (value == strokeWidth(lines(this.props.baseNumberings))) {
      return;
    }

    this.props.app.pushUndo();
    setStrokeWidth(lines(this.props.baseNumberings), value);

    // may be different from the value that was specified
    let constrainedValue = strokeWidth(lines(this.props.baseNumberings));

    BaseNumbering.recommendedDefaults.line['stroke-width'] = (
      constrainedValue
      ?? BaseNumbering.recommendedDefaults.line['stroke-width']
    );
  }
}
