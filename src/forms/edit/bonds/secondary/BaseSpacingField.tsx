import type { App } from 'App';

import type { StrictDrawing } from 'Draw/strict/StrictDrawing';

import { isDot } from 'Draw/bonds/straight/dotify';
import { dotify } from 'Draw/bonds/straight/dotify';

import { isSquare } from 'Draw/bonds/straight/dotify';
import { squarify } from 'Draw/bonds/straight/dotify';

import * as React from 'react';

import { NumberPropertyInput } from 'Forms/edit/objects/NumberPropertyInput';
import type { EditEvent } from 'Forms/edit/objects/NumberPropertyInput';

import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';

import { generateHTMLCompatibleUUID } from 'Utilities/generateHTMLCompatibleUUID';

/**
 * Meant to help make getting and setting the base-pair bond length of
 * the drawing easier.
 */
class DrawingWrapper {
  readonly drawing: StrictDrawing;

  constructor(drawing: StrictDrawing) {
    this.drawing = drawing;
  }

  get basePairBondLength(): number {
    return this.drawing.generalLayoutProps.basePairBondLength;
  }

  set basePairBondLength(basePairBondLength: number) {
    // remember which secondary bonds were dots and squares
    let dotSecondaryBonds = this.drawing.secondaryBonds.filter(isDot);
    let squareSecondaryBonds = this.drawing.secondaryBonds.filter(isSquare);

    // update the base-pair bond length
    this.drawing.generalLayoutProps.basePairBondLength = basePairBondLength;
    this.drawing.updateLayout();

    // make sure are still dots and squares
    dotSecondaryBonds.forEach(dotify);
    squareSecondaryBonds.forEach(squarify);
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

export class BaseSpacingField extends React.Component<Props> {
  get drawing() {
    return new DrawingWrapper(this.props.app.drawing);
  }

  handleBeforeEdit(event: EditEvent) {
    this.props.app.pushUndo();
  }

  handleEdit(event: EditEvent) {
    let newValue = event.newValue;

    // update the drawing
    this.drawing.basePairBondLength = newValue;

    this.props.app.refresh(); // refresh after updating everything else
  }

  render() {
    // the drawing itself should be updated on edit
    let objects = [{ basePairBondLength: this.drawing.basePairBondLength }];

    let style: React.CSSProperties = {
      margin: '10px 0 0 10px',
      alignSelf: 'start',
      cursor: 'text',
    };

    return (
      <FieldLabel style={style} >
        <NumberPropertyInput
          id={inputId}
          objects={objects}
          propertyName='basePairBondLength'
          minValue={0}
          places={2}
          onBeforeEdit={event => this.handleBeforeEdit(event)}
          onEdit={event => this.handleEdit(event)}
          style={{ width: '6ch' }}
        />
        <span style={{ paddingLeft: '8px' }} >
          Base Spacing
        </span>
      </FieldLabel>
    );
  }
}
