import type { App } from 'App';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { secondaryBondTypes } from 'Draw/bonds/straight/SecondaryBond';

import * as SVG from '@svgdotjs/svg.js';
import { strokeWidth } from 'Forms/inputs/svg/strokeWidth/strokeWidth';
import { setStrokeWidth } from 'Forms/inputs/svg/strokeWidth/strokeWidth';
import { numberToDisplayableString as displayableString } from 'Forms/inputs/numbers/numberToDisplayableString';
import { isBlank } from 'Parse/isBlank';

import * as React from 'react';
import textFieldStyles from 'Forms/inputs/text/TextField.css';

// returns the line elements of the secondary bonds
function lines(secondaryBonds: SecondaryBond[]): SVG.Line[] {
  return secondaryBonds.map(bond => bond.line);
}

export type Props = {

  // a reference to the whole app
  app: App;

  // the secondary bonds to edit
  secondaryBonds: SecondaryBond[];
}

export class StrokeWidthField extends React.Component<Props> {
  state: {
    value: string;
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: displayableString(strokeWidth(lines(props.secondaryBonds)), { places: 2 }),
    }
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
        <p
          className={`${textFieldStyles.label} unselectable`}
          style={{ marginLeft: '8px' }}
        >
          Line Width
        </p>
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
    } else if (value == strokeWidth(lines(this.props.secondaryBonds))) {
      return;
    }

    this.props.app.pushUndo();
    setStrokeWidth(lines(this.props.secondaryBonds), value);

    // may be different from the value that was specified
    let constrainedValue = strokeWidth(lines(this.props.secondaryBonds));

    secondaryBondTypes.forEach(t => {
      SecondaryBond.recommendedDefaults[t].line['stroke-width'] = (
        constrainedValue
        ?? SecondaryBond.recommendedDefaults[t].line['stroke-width']
      );
    });
  }
}
