import type { App } from 'App';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

import * as SVG from '@svgdotjs/svg.js';
import { strokeWidth } from 'Forms/inputs/svg/strokeWidth/strokeWidth';
import { setStrokeWidth } from 'Forms/inputs/svg/strokeWidth/strokeWidth';
import { numberToDisplayableString as displayableString } from 'Forms/inputs/numbers/numberToDisplayableString';
import { isBlank } from 'Parse/isBlank';

import * as React from 'react';
import textFieldStyles from 'Forms/inputs/text/TextField.css';

// returns the path elements of the tertiary bonds
function paths(tertiaryBonds: TertiaryBond[]): SVG.Path[] {
  return tertiaryBonds.map(bond => bond.path);
}

export type Props = {

  // a reference to the whole app
  app: App;

  // the tertiary bonds to edit
  tertiaryBonds: TertiaryBond[];
}

export class StrokeWidthField extends React.Component<Props> {
  state: {
    value: string;
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: displayableString(strokeWidth(paths(props.tertiaryBonds)), { places: 2 }),
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
          style={{ width: '36px' }}
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
    if (isBlank(this.state.value)) {
      return;
    }

    let value = Number.parseFloat(this.state.value);
    if (!Number.isFinite(value)) {
      return;
    } else if (value == strokeWidth(paths(this.props.tertiaryBonds))) {
      return;
    }

    this.props.app.pushUndo();
    setStrokeWidth(paths(this.props.tertiaryBonds), value);

    // may be different from the value that was specified
    let constrainedValue = strokeWidth(paths(this.props.tertiaryBonds));

    TertiaryBond.recommendedDefaults.path['stroke-width'] = (
      constrainedValue
      ?? TertiaryBond.recommendedDefaults.path['stroke-width']
    );
  }
}
