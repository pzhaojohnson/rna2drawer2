import type { App } from 'App';

import { CircleBaseAnnotation as BaseOutline } from 'Draw/bases/annotate/circle/CircleBaseAnnotation';

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
   * The base outlines to edit.
   */
  outlines: BaseOutline[];
}

export class FillOpacityInput extends React.Component<Props> {
  handleBeforeEdit(event: EditEvent) {
    this.props.app.pushUndo();
  }

  handleEdit(event: EditEvent) {
    let newValue = event.newValue;

    // don't make base outlines too hard to see by default
    if (newValue >= 0.25) {
      BaseOutline.recommendedDefaults.circle['fill-opacity'] = newValue;
    }

    this.props.app.refresh(); // refresh after updating all values
  }

  render() {
    return (
      <OpacityAttributeInput
        id={id}
        elements={this.props.outlines.map(o => o.circle)}
        attributeName='fill-opacity'
        places={2}
        onBeforeEdit={event => this.handleBeforeEdit(event)}
        onEdit={event => this.handleEdit(event)}
        style={{ width: '32px', textAlign: 'end' }}
      />
    );
  }
}
