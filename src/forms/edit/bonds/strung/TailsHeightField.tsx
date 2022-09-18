import type { App } from 'App';

import type { Bond } from 'Forms/edit/bonds/strung/Bond';
import type { StrungTriangle } from 'Draw/bonds/strung/StrungElement';

import { defaultStrungTriangleValues } from 'Draw/bonds/strung/defaults';

import { repositionStrungElementAtIndex } from 'Forms/edit/bonds/strung/repositionStrungElementAtIndex';

import * as React from 'react';

import { NumberPropertyInput } from 'Forms/edit/objects/NumberPropertyInput';
import { EditEvent } from 'Forms/edit/objects/NumberPropertyInput';

import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';

import { generateHTMLSafeUUID } from 'Utilities/generateHTMLSafeUUID';

const defaultValues = {
  'StrungTriangle': defaultStrungTriangleValues,
};

const inputId = generateHTMLSafeUUID();

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The strung elements to edit.
   */
  strungElements: StrungTriangle[];

  /**
   * The bonds possessing the strung elements.
   */
  bonds: Bond[];

  /**
   * The index that the strung elements are at in the strung elements
   * arrays of the bonds possessing the strung elements.
   */
  strungElementsIndex: number;
};

export class TailsHeightField extends React.Component<Props> {
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

    let newValue = event.newValue;
    let strungElements = this.props.strungElements;
    let types = new Set(strungElements.map(ele => ele.type));
    types.forEach(t => {
      defaultValues[t]['tailsHeight'] = newValue;
    });

    this.props.app.refresh();
  }

  render() {
    let style = { marginTop: '8px', alignSelf: 'start', cursor: 'text' };

    return (
      <FieldLabel style={style} >
        <NumberPropertyInput
          id={inputId}
          objects={this.props.strungElements}
          propertyName='tailsHeight'
          places={2}
          onBeforeEdit={event => this.onBeforeEdit(event)}
          onEdit={event => this.onEdit(event)}
        />
        <span style={{ marginLeft: '8px' }} >
          Tails Height
        </span>
      </FieldLabel>
    );
  }
}
