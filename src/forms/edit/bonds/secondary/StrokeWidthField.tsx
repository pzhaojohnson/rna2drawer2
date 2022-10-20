import type { App } from 'App';

import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';

import * as React from 'react';

import { NumericAttributeInput } from 'Forms/edit/svg/NumericAttributeInput';
import type { EditEvent } from 'Forms/edit/svg/NumericAttributeInput';

import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';

import { generateHTMLCompatibleUUID } from 'Utilities/generateHTMLCompatibleUUID';

// should be stable across mountings and unmountings
// (to facilitate refocusing when the app is refreshed)
const inputId = generateHTMLCompatibleUUID();

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

export class StrokeWidthField extends React.Component<Props> {
  handleBeforeEdit(event: EditEvent) {
    this.props.app.pushUndo();
  }

  handleEdit(event: EditEvent) {
    let newValue = event.newValue;
    let types = new Set(this.props.secondaryBonds.map(sb => sb.type));

    // don't make secondary bonds too hard to see by default
    if (newValue > 0.25) {
      types.forEach(t => {
        SecondaryBond.recommendedDefaults[t].line['stroke-width'] = newValue;
      });
    }

    this.props.app.refresh();
  }

  render() {
    return (
      <FieldLabel style={{ marginTop: '8px', alignSelf: 'start' }} >
        <NumericAttributeInput
          id={inputId}
          elements={this.props.secondaryBonds.map(sb => sb.line)}
          attributeName='stroke-width'
          minValue={0}
          places={2}
          onBeforeEdit={event => this.handleBeforeEdit(event)}
          onEdit={event => this.handleEdit(event)}
          style={{ minWidth: '32px' }}
        />
        <span style={{ paddingLeft: '8px' }} >
          Line Width
        </span>
      </FieldLabel>
    );
  }
}
