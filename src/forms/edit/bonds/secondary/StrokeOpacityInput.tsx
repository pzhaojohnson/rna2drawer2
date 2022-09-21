import type { App } from 'App';

import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';

import * as React from 'react';

import { OpacityAttributeInput } from 'Forms/edit/svg/OpacityAttributeInput';
import type { EditEvent } from 'Forms/edit/svg/OpacityAttributeInput';

import { generateHTMLSafeUUID } from 'Utilities/generateHTMLSafeUUID';

// should be stable across mountings and unmountings
// (to facilitate refocusing on refresh)
const id = generateHTMLSafeUUID();

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The secondary bonds to edit.
   */
  secondaryBonds: SecondaryBond[];
}

export class StrokeOpacityInput extends React.Component<Props> {
  handleBeforeEdit(event: EditEvent) {
    this.props.app.pushUndo();
  }

  handleEdit(event: EditEvent) {
    let newValue = event.newValue;
    let types = new Set(this.props.secondaryBonds.map(sb => sb.type));

    // don't make secondary bonds invisible by default
    if (newValue > 0) {
      types.forEach(t => {
        SecondaryBond.recommendedDefaults[t].line['stroke-opacity'] = newValue;
      });
    }

    this.props.app.refresh();
  }

  render() {
    return (
      <OpacityAttributeInput
        id={id}
        elements={this.props.secondaryBonds.map(sb => sb.line)}
        attributeName='stroke-opacity'
        places={2}
        onBeforeEdit={event => this.handleBeforeEdit(event)}
        onEdit={event => this.handleEdit(event)}
        style={{ textAlign: 'end' }}
      />
    );
  }
}
