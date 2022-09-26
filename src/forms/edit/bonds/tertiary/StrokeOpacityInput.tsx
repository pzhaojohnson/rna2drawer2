import type { App } from 'App';

import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

import * as React from 'react';

import { OpacityAttributeInput } from 'Forms/edit/svg/OpacityAttributeInput';
import type { EditEvent } from 'Forms/edit/svg/OpacityAttributeInput';

import { generateHTMLCompatibleUUID } from 'Utilities/generateHTMLCompatibleUUID';

// should be stable across mountings and unmountings
// (to facilitate refocusing when the app is refreshed)
const id = generateHTMLCompatibleUUID();

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The tertiary bonds to edit.
   */
  tertiaryBonds: TertiaryBond[];
}

export class StrokeOpacityInput extends React.Component<Props> {
  handleBeforeEdit(event: EditEvent) {
    this.props.app.pushUndo();
  }

  handleEdit(event: EditEvent) {
    let newValue = event.newValue;

    // don't make tertiary bonds too hard to see by default
    if (newValue >= 0.25) {
      TertiaryBond.recommendedDefaults.path['stroke-opacity'] = newValue;
    }

    this.props.app.refresh(); // refresh after updating all values
  }

  render() {
    let style: React.CSSProperties = {
      marginRight: '8px',
      width: '32px',
      textAlign: 'end',
    };

    return (
      <OpacityAttributeInput
        id={id}
        elements={this.props.tertiaryBonds.map(tb => tb.path)}
        attributeName='stroke-opacity'
        places={2}
        onBeforeEdit={event => this.handleBeforeEdit(event)}
        onEdit={event => this.handleEdit(event)}
        style={style}
      />
    );
  }
}
