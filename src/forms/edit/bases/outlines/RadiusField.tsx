import * as React from 'react';
import { TextInputField } from 'Forms/inputs/text/TextInputField';
import type { App } from 'App';
import { CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotation';
import { interpretNumber } from 'Draw/svg/interpretNumber';
import { round } from 'Math/round';

export type Props = {
  app: App;

  // the outlines to edit
  outlines: CircleBaseAnnotation[];
}

type Value = string;

type State = {
  value: Value;
}

// returns an empty string value for an empty outlines array
// or if not all outlines have the same radius
function currRadius(outlines: CircleBaseAnnotation[]): Value {
  let rs = new Set<Value>();
  outlines.forEach(o => {
    let r = o.circle.attr('r');
    let n = interpretNumber(r);
    if (n) {
      let pxs = n.convert('px').valueOf();
      pxs = round(pxs, 2);
      rs.add(pxs.toString());
    }
  });
  if (rs.size == 1) {
    return rs.values().next().value;
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

function constrainRadius(r: number): number {
  if (!Number.isFinite(r)) {
    return 8;
  } else if (r < 0) {
    return 0;
  } else {
    return r;
  }
}

export class RadiusField extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: currRadius(props.outlines),
    };
  }

  render() {
    return (
      <TextInputField
        label='Radius'
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
    if (!isBlank(this.state.value)) {
      let r = Number.parseFloat(this.state.value);
      if (Number.isFinite(r)) {
        if (!areEqual(this.state.value, currRadius(this.props.outlines))) {
          this.props.app.pushUndo();
          r = constrainRadius(r);
          this.props.outlines.forEach(o => {
            o.circle.attr({ 'r': r });
          });
          CircleBaseAnnotation.recommendedDefaults.circle['r'] = r;
          this.props.app.refresh();
        }
      }
    }
  }
}
