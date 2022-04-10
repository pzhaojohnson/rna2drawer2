import type { App } from 'App';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

import * as SVG from '@svgdotjs/svg.js';
import { strokeOpacity } from 'Forms/inputs/svg/strokeOpacity/strokeOpacity';
import { setStrokeOpacity } from 'Forms/inputs/svg/strokeOpacity/strokeOpacity';
import { displayablePercentageString } from 'Forms/inputs/numbers/displayablePercentageString';
import { isBlank } from 'Parse/isBlank';
import { parsePercentageString } from 'Forms/inputs/numbers/parsePercentageString';

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

export class StrokeOpacityInput extends React.Component<Props> {
  state: {
    value: string;
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: displayablePercentageString(strokeOpacity(paths(props.tertiaryBonds)), { places: 0 }),
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
    if (isBlank(this.state.value)) {
      return;
    }

    let value = parsePercentageString(this.state.value);
    if (!Number.isFinite(value)) {
      return;
    } else if (value == strokeOpacity(paths(this.props.tertiaryBonds))) {
      return;
    }

    this.props.app.pushUndo();
    setStrokeOpacity(paths(this.props.tertiaryBonds), value);

    // may be different from the value that was specified
    let constrainedValue = strokeOpacity(paths(this.props.tertiaryBonds));

    TertiaryBond.recommendedDefaults.path['stroke-opacity'] = (
      constrainedValue
      ?? TertiaryBond.recommendedDefaults.path['stroke-opacity']
    );
  }
}
