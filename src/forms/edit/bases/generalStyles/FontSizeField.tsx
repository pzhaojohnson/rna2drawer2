import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';
import { BaseInterface } from 'Draw/bases/BaseInterface';
import { Base } from 'Draw/bases/Base';
import { parseNumber } from 'Parse/svg/number';
import { round } from 'Math/round';

export type Props = {
  app: App;

  // the bases to edit
  bases: BaseInterface[];
}

type Value = string;

type State = {
  value: Value;
}

// returns an empty string value for an empty bases array
// or if not all bases have the same font size
function currFontSize(bases: BaseInterface[]): Value {
  let fss = new Set<Value>();
  bases.forEach(b => {
    let fs = b.text.attr('font-size');
    let n = parseNumber(fs);
    if (n) {
      let pxs = n.convert('px').valueOf();
      pxs = round(pxs, 2);
      fss.add(pxs.toString());
    }
  });
  if (fss.size == 1) {
    return fss.values().next().value;
  } else {
    return '';
  }
}

function isBlank(v: Value): boolean {
  return v.trim().length == 0;
}

function areEqual(v1: Value, v2: Value): boolean {
  return Number.parseFloat(v1) == Number.parseFloat(v2);
}

function constrainFontSize(fs: number): number {
  if (!Number.isFinite(fs)) {
    return 9;
  } else if (fs < 0) {
    return 0;
  } else {
    return fs;
  }
}

export class FontSizeField extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: currFontSize(props.bases),
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
            this.props.app.drawingChangedNotByInteraction();
          }}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              this.submit();
              this.props.app.drawingChangedNotByInteraction();
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
    if (!isBlank(this.state.value)) {
      let fs = Number.parseFloat(this.state.value);
      if (Number.isFinite(fs)) {
        if (!areEqual(this.state.value, currFontSize(this.props.bases))) {
          this.props.app.pushUndo();
          fs = constrainFontSize(fs);

          this.props.bases.forEach(b => {

            // remember center coordinates
            let bbox = b.text.bbox();
            let center = { x: bbox.cx, y: bbox.cy };

            b.text.attr({ 'font-size': fs });

            // recenter
            b.text.center(center.x, center.y);
          });

          Base.recommendedDefaults.text['font-size'] = fs;
          this.props.app.drawingChangedNotByInteraction();
        }
      }
    }
  }
}
