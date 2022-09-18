import type { App } from 'App';

import type { Bond } from 'Forms/edit/bonds/strung/Bond';

import type { StrungTriangle } from 'Draw/bonds/strung/StrungElement';
import type { StrungRectangle } from 'Draw/bonds/strung/StrungElement';

import { repositionStrungElementAtIndex } from 'Forms/edit/bonds/strung/repositionStrungElementAtIndex';

import * as React from 'react';

import { DirectionAnglePropertyInput } from 'Forms/edit/objects/DirectionAnglePropertyInput';
import { EditEvent } from 'Forms/edit/objects/DirectionAnglePropertyInput';

import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';

import { generateHTMLSafeUUID } from 'Utilities/generateHTMLSafeUUID';

const inputId = generateHTMLSafeUUID();

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The strung elements to edit.
   */
  strungElements: (
    StrungTriangle
    | StrungRectangle
  )[];

  /**
   * The bonds possessing the strung elements.
   */
  bonds: Bond[];

  /**
   * The index that the strung elements are at in the strung elements
   * arrays of the bonds possessing the strung elements.
   */
  strungElementsIndex: number;

  style?: React.CSSProperties;
};

export class RotationField extends React.Component<Props> {
  onBeforeEdit(event: EditEvent) {
    this.props.app.pushUndo();
  }

  onEdit(event: EditEvent) {
    this.props.bonds.forEach(bond => {
      repositionStrungElementAtIndex({
        bond,
        index: this.props.strungElementsIndex,
      });
    });

    this.props.app.refresh();
  }

  render() {
    let style = {
      marginTop: '8px', alignSelf: 'start', cursor: 'text',
      ...this.props.style,
    };

    return (
      <FieldLabel style={style} >
        <DirectionAnglePropertyInput
          id={inputId}
          objects={this.props.strungElements}
          propertyName='rotation'
          angleFloor={0}
          places={2}
          displayedPlaces={0}
          onBeforeEdit={event => this.onBeforeEdit(event)}
          onEdit={event => this.onEdit(event)}
        />
        <span style={{ marginLeft: '8px' }} >
          Rotation
        </span>
      </FieldLabel>
    );
  }
}
