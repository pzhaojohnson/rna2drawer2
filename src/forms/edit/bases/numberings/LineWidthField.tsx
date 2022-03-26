import * as React from 'react';
import textFieldStyles from 'Forms/inputs/text/TextField.css';
import type { App } from 'App';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import { interpretNumber } from 'Draw/svg/interpretNumber';
import { round } from 'Math/round';

export type Props = {
  app: App;

  // the base numberings to edit
  baseNumberings: BaseNumbering[];
}

type Value = string;

type State = {
  value: Value;
}

// returns an empty string value for an empty base numberings array
// or if not all base numberings have the same line width
function currLineWidth(baseNumberings: BaseNumbering[]): Value {
  let lws = new Set<Value>();
  baseNumberings.forEach(bn => {
    let sw = bn.line.attr('stroke-width');
    let n = interpretNumber(sw);
    if (n) {
      let pxs = n.convert('px').valueOf();
      pxs = round(pxs, 2);
      lws.add(pxs.toString());
    }
  });
  if (lws.size == 1) {
    return lws.values().next().value;
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

function constrainLineWidth(lw: number): number {
  if (!Number.isFinite(lw)) {
    return 1;
  } else if (lw < 0) {
    return 0;
  } else {
    return lw;
  }
}

export class LineWidthField extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: currLineWidth(props.baseNumberings),
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
    if (!isBlank(this.state.value)) {
      let lw = Number.parseFloat(this.state.value);
      if (Number.isFinite(lw)) {
        if (!areEqual(this.state.value, currLineWidth(this.props.baseNumberings))) {
          this.props.app.pushUndo();
          lw = constrainLineWidth(lw);
          this.props.baseNumberings.forEach(bn => {
            bn.line.attr({ 'stroke-width': lw });
          });
          BaseNumbering.recommendedDefaults.line['stroke-width'] = lw;
          this.props.app.refresh();
        }
      }
    }
  }
}
