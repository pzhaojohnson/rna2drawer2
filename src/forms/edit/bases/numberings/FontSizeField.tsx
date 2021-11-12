import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';
import { BaseNumberingInterface } from 'Draw/bases/number/BaseNumberingInterface';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import { parseNumber } from 'Parse/svg/number';
import { round } from 'Math/round';

export type Props = {
  app: App;

  // the base numberings to edit
  baseNumberings: BaseNumberingInterface[];
}

type Value = string;

type State = {
  value: Value;
}

// returns an empty string value for an empty base numberings array
// or if not all base numberings have the same font size
function currFontSize(baseNumberings: BaseNumberingInterface[]): Value {
  let fss = new Set<Value>();
  baseNumberings.forEach(bn => {
    let fs = bn.text.attr('font-size');
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
    return 8;
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
      value: currFontSize(props.baseNumberings),
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
    if (!isBlank(this.state.value)) {
      let fs = Number.parseFloat(this.state.value);
      if (Number.isFinite(fs)) {
        if (!areEqual(this.state.value, currFontSize(this.props.baseNumberings))) {
          this.props.app.pushUndo();
          fs = constrainFontSize(fs);
          this.props.baseNumberings.forEach(bn => {
            bn.text.attr({ 'font-size': fs });
            bn.reposition();
          });
          BaseNumbering.recommendedDefaults.text['font-size'] = fs;
          this.props.app.refresh();
        }
      }
    }
  }
}