import type { App } from 'App';

import type { Bond } from 'Forms/edit/bonds/strung/Bond';
import type { StrungRectangle } from 'Draw/bonds/strung/StrungElement';

import { defaultStrungRectangleValues } from 'Draw/bonds/strung/defaults';

import { repositionStrungElementAtIndex } from 'Forms/edit/bonds/strung/repositionStrungElementAtIndex';

import * as React from 'react';

import { NumberPropertyInput } from 'Forms/edit/objects/NumberPropertyInput';
import { EditEvent } from 'Forms/edit/objects/NumberPropertyInput';

import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';

import { generateHTMLSafeUUID } from 'Utilities/generateHTMLSafeUUID';

const defaultValues = {
  'StrungRectangle': defaultStrungRectangleValues,
};

const baseInputId = generateHTMLSafeUUID();

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The strung elements to edit.
   */
  strungElements: StrungRectangle[];

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

export class BorderRadiusField extends React.Component<Props> {
  get inputId(): string {
    // make different for each strung elements index
    return baseInputId + this.props.strungElementsIndex;
  }

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
      defaultValues[t]['borderRadius'] = newValue;
    });

    this.props.app.refresh();
  }

  render() {
    let style = { marginTop: '8px', alignSelf: 'start', cursor: 'text' };

    return (
      <FieldLabel style={style} >
        <NumberPropertyInput
          id={this.inputId}
          objects={this.props.strungElements}
          propertyName='borderRadius'
          minValue={0}
          places={2}
          onBeforeEdit={event => this.onBeforeEdit(event)}
          onEdit={event => this.onEdit(event)}
        />
        <span style={{ marginLeft: '8px' }} >
          Corner Radius
        </span>
      </FieldLabel>
    );
  }
}
