import type { App } from 'App';
import { CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotation';

import * as SVG from '@svgdotjs/svg.js';
import { strokeWidth } from 'Forms/inputs/svg/strokeWidth/strokeWidth';
import { setStrokeWidth } from 'Forms/inputs/svg/strokeWidth/strokeWidth';
import { numberToDisplayableString as displayableString } from 'Forms/inputs/numbers/numberToDisplayableString';
import { isBlank } from 'Parse/isBlank';

import * as React from 'react';
import textFieldStyles from 'Forms/inputs/text/TextField.css';

// returns the circle elements of the outlines
function circles(outlines: CircleBaseAnnotation[]): SVG.Circle[] {
  return outlines.map(outline => outline.circle);
}

export type Props = {

  // a reference to the whole app
  app: App;

  // the outlines to edit
  outlines: CircleBaseAnnotation[];
}

export class StrokeWidthField extends React.Component<Props> {
  state: {
    value: string;
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: displayableString(strokeWidth(circles(props.outlines)), { places: 2 }),
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
            Line Width
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
    } else if (n == strokeWidth(circles(this.props.outlines))) {
      return;
    }

    this.props.app.pushUndo();
    setStrokeWidth(circles(this.props.outlines), n);
    CircleBaseAnnotation.recommendedDefaults.circle['stroke-width'] = n;
    this.props.app.refresh();
  }
}
