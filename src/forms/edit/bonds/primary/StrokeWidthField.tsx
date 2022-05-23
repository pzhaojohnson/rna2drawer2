import type { App } from 'App';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';

import * as SVG from '@svgdotjs/svg.js';
import { strokeWidth } from 'Forms/inputs/svg/strokeWidth/strokeWidth';
import { setStrokeWidth } from 'Forms/inputs/svg/strokeWidth/strokeWidth';
import { numberToDisplayableString as displayableString } from 'Forms/inputs/numbers/numberToDisplayableString';
import { isBlank } from 'Parse/isBlank';

import * as React from 'react';
import { TextInputField } from 'Forms/inputs/text/TextInputField';

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

export class StrokeWidthField extends React.Component<Props> {
  state: {
    value: string;
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: displayableString(strokeWidth(lines(props.primaryBonds)), { places: 2 }),
    }
  }

  render() {
    return (
      <TextInputField
        label='Line Width'
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
        style={{ marginTop: '14px', alignSelf: 'start' }}
      />
    );
  }

  submit() {
    if (isBlank(this.state.value)) {
      return;
    }

    let value = Number.parseFloat(this.state.value);
    if (!Number.isFinite(value)) {
      return;
    } else if (value == strokeWidth(lines(this.props.primaryBonds))) {
      return;
    }

    this.props.app.pushUndo();
    setStrokeWidth(lines(this.props.primaryBonds), value);

    // may be different from the value that was specified
    let constrainedValue = strokeWidth(lines(this.props.primaryBonds));

    PrimaryBond.recommendedDefaults.line['stroke-width'] = (
      constrainedValue
      ?? PrimaryBond.recommendedDefaults.line['stroke-width']
    );
  }
}
