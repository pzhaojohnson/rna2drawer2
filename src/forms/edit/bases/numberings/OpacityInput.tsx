import type { App } from 'App';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';

import * as SVG from '@svgdotjs/svg.js';
import { fillOpacity } from 'Forms/inputs/svg/fillOpacity/fillOpacity';
import { setFillOpacity } from 'Forms/inputs/svg/fillOpacity/fillOpacity';
import { strokeOpacity } from 'Forms/inputs/svg/strokeOpacity/strokeOpacity';
import { setStrokeOpacity } from 'Forms/inputs/svg/strokeOpacity/strokeOpacity';
import { displayablePercentageString } from 'Forms/inputs/numbers/displayablePercentageString';
import { isBlank } from 'Parse/isBlank';
import { parsePercentageString } from 'Forms/inputs/numbers/parsePercentageString';

import * as React from 'react';
import textFieldStyles from 'Forms/inputs/text/TextField.css';

// returns the text elements of the base numberings
function texts(baseNumberings: BaseNumbering[]): SVG.Text[] {
  return baseNumberings.map(bn => bn.text);
}

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

export class OpacityInput extends React.Component<Props> {
  state: {
    value: string;
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      // assumes that texts fill-opacity is the same as lines stroke-opacity
      value: displayablePercentageString(fillOpacity(texts(props.baseNumberings)), { places: 0 }),
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
        style={{ marginRight: '8px', width: '32px', textAlign: 'end' }}
      />
    );
  }

  submit() {
    if (isBlank(this.state.value)) {
      return;
    }

    let value = parsePercentageString(this.state.value);
    if (!Number.isFinite(value)) {
      return;
    } else if (value == fillOpacity(texts(this.props.baseNumberings))) {
      return;
    }

    this.props.app.pushUndo();
    setFillOpacity(texts(this.props.baseNumberings), value);
    setStrokeOpacity(lines(this.props.baseNumberings), value);

    // may be different from the value that was specified
    let constrainedValue = fillOpacity(texts(this.props.baseNumberings));

    BaseNumbering.recommendedDefaults.text['fill-opacity'] = (
      constrainedValue
      ?? BaseNumbering.recommendedDefaults.text['fill-opacity']
    );

    // may be different from the value that was specified
    constrainedValue = strokeOpacity(lines(this.props.baseNumberings));

    BaseNumbering.recommendedDefaults.line['stroke-opacity'] = (
      constrainedValue
      ?? BaseNumbering.recommendedDefaults.line['stroke-opacity']
    );
  }
}
