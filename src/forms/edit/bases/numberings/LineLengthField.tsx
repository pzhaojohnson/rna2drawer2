import * as React from 'react';
import { TextInputField } from 'Forms/inputs/text/TextInputField';
import type { App } from 'App';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
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
// or if not all base numberings have the same line length
function currLineLength(baseNumberings: BaseNumbering[]): Value {
  let lls = new Set<Value>();
  baseNumberings.forEach(bn => {
    let ll = bn.lineLength;
    if (typeof ll == 'number') {
      ll = round(ll, 2);
      lls.add(ll.toString());
    }
  });
  if (lls.size == 1) {
    return lls.values().next().value;
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

function constrainLineLength(ll: number): number {
  if (!Number.isFinite(ll)) {
    return 8;
  } else if (ll < 0) {
    return 0;
  } else {
    return ll;
  }
}

export class LineLengthField extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: currLineLength(props.baseNumberings),
    };
  }

  render() {
    return (
      <TextInputField
        label='Line Length'
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
      let ll = Number.parseFloat(this.state.value);
      if (Number.isFinite(ll)) {
        if (!areEqual(this.state.value, currLineLength(this.props.baseNumberings))) {
          this.props.app.pushUndo();
          ll = constrainLineLength(ll);
          this.props.baseNumberings.forEach(bn => {
            bn.lineLength = ll;
          });
          BaseNumbering.recommendedDefaults.lineLength = ll;
          this.props.app.refresh();
        }
      }
    }
  }
}
