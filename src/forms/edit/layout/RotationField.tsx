import type { App } from 'App';

import type { StrictDrawing } from 'Draw/strict/StrictDrawing';

import * as React from 'react';

import { DirectionAnglePropertyInput } from 'Forms/edit/objects/DirectionAnglePropertyInput';
import type { EditEvent } from 'Forms/edit/objects/DirectionAnglePropertyInput';

import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';

import { generateHTMLCompatibleUUID } from 'Utilities/generateHTMLCompatibleUUID';

/**
 * Meant to make getting and setting the rotation of the drawing easier.
 */
class DrawingWrapper {
  readonly drawing: StrictDrawing;

  constructor(drawing: StrictDrawing) {
    this.drawing = drawing;
  }

  get rotation(): number {
    return this.drawing.generalLayoutProps.rotation;
  }

  set rotation(rotation: number) {
    this.drawing.generalLayoutProps.rotation = rotation;
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
}

export class RotationField extends React.Component<Props> {
  get drawing() {
    return new DrawingWrapper(this.props.app.drawing);
  }

  handleBeforeEdit(event: EditEvent) {
    this.props.app.pushUndo();
  }

  handleEdit(event: EditEvent) {
    let newValue = event.newValue;

    // update the actual rotation of the drawing
    this.drawing.rotation = newValue;

    this.props.app.refresh(); // refresh after updating everything
  }

  render() {
    // the actual rotation of the drawing should be updated on edit
    let objects = [{ rotation: this.drawing.rotation }];

    let style: React.CSSProperties = {
      alignSelf: 'start',
      cursor: 'text',
    };

    return (
      <FieldLabel style={style} >
        <DirectionAnglePropertyInput
          id={inputId}
          objects={objects}
          propertyName='rotation'
          angleFloor={0}
          places={6}
          displayedPlaces={1}
          onBeforeEdit={event => this.handleBeforeEdit(event)}
          onEdit={event => this.handleEdit(event)}
          style={{ minWidth: '7ch' }}
        />
        <span style={{ paddingLeft: '8px' }} >
          Rotation
        </span>
      </FieldLabel>
    );
  }
}
