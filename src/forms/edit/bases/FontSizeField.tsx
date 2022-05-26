import type { App } from 'App';
import { Base } from 'Draw/bases/Base';

import * as SVG from '@svgdotjs/svg.js';
import { fontSize } from 'Forms/inputs/svg/fontSize/fontSize';
import { setFontSize } from 'Forms/inputs/svg/fontSize/fontSize';
import { numberToDisplayableString as displayableString } from 'Forms/inputs/numbers/numberToDisplayableString';
import { isBlank } from 'Parse/isBlank';

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

export class FontSizeField extends React.Component<Props> {
  state: {
    value: string;
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: displayableString(fontSize(texts(props.bases)), { places: 1 }),
    };
  }

  render() {
    return (
      <div
        style={{
          marginTop: '10px',
          display: 'flex', flexDirection: 'row', alignItems: 'center',
        }}
      >
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
          style={{ width: '36px' }}
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

    let value = Number.parseFloat(this.state.value);
    if (!Number.isFinite(value)) {
      return;
    } else if (value == fontSize(texts(this.props.bases))) {
      return;
    }

    this.props.app.pushUndo();

    // remember center coordinates
    let centers = texts(this.props.bases).map(text => {
      let bbox = text.bbox();
      return { x: bbox.cx, y: bbox.cy };
    });

    setFontSize(texts(this.props.bases), value);

    // recenter
    texts(this.props.bases).forEach((text, i) => {
      let center = centers[i];
      text.center(center.x, center.y);
    });

    // may be different from the value that was specified
    let constrainedValue = fontSize(texts(this.props.bases));

    Base.recommendedDefaults.text['font-size'] = (
      constrainedValue
      ?? Base.recommendedDefaults.text['font-size']
    );
  }
}
