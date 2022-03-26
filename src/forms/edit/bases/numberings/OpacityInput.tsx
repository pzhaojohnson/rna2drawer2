import * as React from 'react';
import textFieldStyles from 'Forms/inputs/text/TextField.css';
import type { App } from 'App';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import * as SVG from '@svgdotjs/svg.js';
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

function toRoundedPercentage(n: SVG.Number): Value {
  let p = 100 * n.valueOf();
  p = round(p, 0);
  return p + '%';
}

// returns an empty string value for an empty base numberings array
// or if not all base numbering texts and lines have the same opacity
function currOpacityPercentage(baseNumberings: BaseNumbering[]): Value {
  let ops = new Set<Value>();
  baseNumberings.forEach(bn => {
    let textOpacity = interpretNumber(bn.text.attr('fill-opacity'));
    if (textOpacity) {
      ops.add(toRoundedPercentage(textOpacity));
    }
    let lineOpacity = interpretNumber(bn.line.attr('stroke-opacity'));
    if (lineOpacity) {
      ops.add(toRoundedPercentage(lineOpacity));
    }
  });
  if (ops.size == 1) {
    return ops.values().next().value;
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

function constrainOpacity(o: number): number {
  if (!Number.isFinite(o)) {
    return 1;
  } else if (o < 0) {
    return 0;
  } else if (o > 1) {
    return 1;
  } else {
    return o;
  }
}

export class OpacityInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: currOpacityPercentage(props.baseNumberings),
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
    if (!isBlank(this.state.value)) {
      let op = Number.parseFloat(this.state.value);
      if (Number.isFinite(op)) {
        if (!areEqual(this.state.value, currOpacityPercentage(this.props.baseNumberings))) {
          this.props.app.pushUndo();
          let o = op / 100;
          o = constrainOpacity(o);
          o = round(o, 6);
          this.props.baseNumberings.forEach(bn => {
            bn.text.attr({ 'fill-opacity': o });
            bn.line.attr({ 'stroke-opacity': o });
          });
          BaseNumbering.recommendedDefaults.text['fill-opacity'] = o;
          BaseNumbering.recommendedDefaults.line['stroke-opacity'] = o;
          this.props.app.refresh();
        }
      }
    }
  }
}
