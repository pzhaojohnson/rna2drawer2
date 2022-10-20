import type { App } from 'App';

import type { StrictDrawing } from 'Draw/strict/StrictDrawing';

import * as React from 'react';

import { NumberPropertyInput } from 'Forms/edit/objects/NumberPropertyInput';
import type { EditEvent } from 'Forms/edit/objects/NumberPropertyInput';

import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';

import { generateHTMLCompatibleUUID } from 'Utilities/generateHTMLCompatibleUUID';

/**
 * Meant to help make getting and setting the termini gap of the drawing
 * easier.
 */
class DrawingWrapper {
  readonly drawing: StrictDrawing;

  constructor(drawing: StrictDrawing) {
    this.drawing = drawing;
  }

  get terminiGap(): number {
    return this.drawing.generalLayoutProps.terminiGap;
  }

  set terminiGap(terminiGap: number) {
    this.drawing.generalLayoutProps.terminiGap = terminiGap;
    this.drawing.updateLayout();
  }
}

// should be stable across mountings and unmountings
// (to facilitate refocusing when the app is refreshed)
const inputId = generateHTMLCompatibleUUID();

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;
};

export class TerminiGapField extends React.Component<Props> {
  get drawing() {
    return new DrawingWrapper(this.props.app.drawing);
  }

  handleBeforeEdit(event: EditEvent) {
    this.props.app.pushUndo();
  }

  handleEdit(event: EditEvent) {
    let newValue = event.newValue;

    // update the actual termini gap of the drawing
    this.drawing.terminiGap = newValue;

    this.props.app.refresh(); // refresh after updating everything
  }

  render() {
    // the actual termini gap of the drawing should be updated on edit
    let objects = [{ terminiGap: this.drawing.terminiGap }];

    let style: React.CSSProperties = {
      alignSelf: 'start',
      cursor: 'text',
    };

    return (
      <FieldLabel style={style} >
        <NumberPropertyInput
          id={inputId}
          objects={objects}
          propertyName='terminiGap'
          minValue={0}
          places={2}
          onBeforeEdit={event => this.handleBeforeEdit(event)}
          onEdit={event => this.handleEdit(event)}
          style={{ minWidth: '7ch' }}
        />
        <span style={{ paddingLeft: '8px' }} >
          Termini Gap
        </span>
      </FieldLabel>
    );
  }
}
