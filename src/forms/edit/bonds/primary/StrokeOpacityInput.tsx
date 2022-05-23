import type { App } from 'App';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';

import * as SVG from '@svgdotjs/svg.js';
import { strokeOpacity } from 'Forms/inputs/svg/strokeOpacity/strokeOpacity';
import { setStrokeOpacity } from 'Forms/inputs/svg/strokeOpacity/strokeOpacity';
import { displayablePercentageString } from 'Forms/inputs/numbers/displayablePercentageString';
import { isBlank } from 'Parse/isBlank';
import { parsePercentageString } from 'Forms/inputs/numbers/parsePercentageString';

import * as React from 'react';
import { TextInput } from 'Forms/inputs/text/TextInput';

// returns the line elements of the primary bonds
function lines(primaryBonds: PrimaryBond[]): SVG.Line[] {
  return primaryBonds.map(primaryBond => primaryBond.line);
}

export type Props = {

  // a reference to the whole app
  app: App;

  // the primary bonds to edit
  primaryBonds: PrimaryBond[];
}

export class StrokeOpacityInput extends React.Component<Props> {
  state: {
    value: string;
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: displayablePercentageString(strokeOpacity(lines(props.primaryBonds)), { places: 0 }),
    };
  }

  render() {
    return (
      <TextInput
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
    } else if (value == strokeOpacity(lines(this.props.primaryBonds))) {
      return;
    }

    this.props.app.pushUndo();
    setStrokeOpacity(lines(this.props.primaryBonds), value);

    // may be different from the value that was specified
    let constrainedValue = strokeOpacity(lines(this.props.primaryBonds));

    PrimaryBond.recommendedDefaults.line['stroke-opacity'] = (
      constrainedValue
      ?? PrimaryBond.recommendedDefaults.line['stroke-opacity']
    );
  }
}
