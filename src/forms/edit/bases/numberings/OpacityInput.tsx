import type { App } from 'App';

import { BaseNumbering } from 'Draw/bases/numberings/BaseNumbering';

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
   * The base numberings to edit.
   */
  baseNumberings: BaseNumbering[];
}

export class OpacityInput extends React.Component<Props> {
  handleBeforeEdit(event: EditEvent) {
    this.props.app.pushUndo();
  }

  handleEdit(event: EditEvent) {
    let newValue = event.newValue;

    // make text and line elements opacities the same
    this.props.baseNumberings.forEach(bn => {
      bn.text.attr('fill-opacity', newValue);
      bn.line.attr('stroke-opacity', newValue);
    });

    // don't make base numberings too hard to see by default
    if (newValue >= 0.25) {
      BaseNumbering.recommendedDefaults.text['fill-opacity'] = newValue;
      BaseNumbering.recommendedDefaults.line['stroke-opacity'] = newValue;
    }

    this.props.app.refresh(); // refresh after updating all values
  }

  render() {
    // line elements stroke opacities should be updated on edit
    let elements = this.props.baseNumberings.map(bn => bn.text);
    const attributeName = 'fill-opacity';

    return (
      <OpacityAttributeInput
        id={id}
        elements={elements}
        attributeName={attributeName}
        places={2}
        onBeforeEdit={event => this.handleBeforeEdit(event)}
        onEdit={event => this.handleEdit(event)}
        style={{
          marginRight: '8px',
          minWidth: '32px',
          textAlign: 'end',
        }}
      />
    );
  }
}
