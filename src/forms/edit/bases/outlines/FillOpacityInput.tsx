import type { App } from 'App';
import { CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotation';

import * as SVG from '@svgdotjs/svg.js';
import { fillOpacity } from 'Forms/inputs/svg/fillOpacity/fillOpacity';
import { setFillOpacity } from 'Forms/inputs/svg/fillOpacity/fillOpacity';
import { displayablePercentageString } from 'Forms/inputs/numbers/displayablePercentageString';
import { isBlank } from 'Parse/isBlank';
import { parsePercentageString } from 'Forms/inputs/numbers/parsePercentageString';

import * as React from 'react';
import textFieldStyles from 'Forms/inputs/text/TextField.css';

function circles(outlines: CircleBaseAnnotation[]): SVG.Circle[] {
  return outlines.map(outline => outline.circle);
}

export type Props = {

  // a reference to the whole app
  app: App;

  // the outlines to edit
  outlines: CircleBaseAnnotation[];
}

export class FillOpacityInput extends React.Component<Props> {
  state: {
    value: string;
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: displayablePercentageString(fillOpacity(circles(props.outlines)), { places: 0 }),
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

    let value = parsePercentageString(this.state.value);
    if (!Number.isFinite(value)) {
      return;
    } else if (value == fillOpacity(circles(this.props.outlines))) {
      return;
    }

    this.props.app.pushUndo();
    setFillOpacity(circles(this.props.outlines), value);

    // may be different from the value that was specified
    let constrainedValue = fillOpacity(circles(this.props.outlines));

    CircleBaseAnnotation.recommendedDefaults.circle['fill-opacity'] = (
      constrainedValue
      ?? CircleBaseAnnotation.recommendedDefaults.circle['fill-opacity']
    );
  }
}
