import type { App } from 'App';

import type { StrungCircle } from 'Draw/bonds/strung/StrungElement';

import { defaultStrungCircleValues } from 'Draw/bonds/strung/defaults';

import { svgElementOfStrungElement } from 'Forms/edit/bonds/strung/svgElementOfStrungElement';

import * as React from 'react';

import { NumericAttributeInput } from 'Forms/edit/svg/NumericAttributeInput';
import { EditEvent } from 'Forms/edit/svg/NumericAttributeInput';

import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';

const defaultSVGElementAttributes = {
  'StrungCircle': defaultStrungCircleValues.circle,
};

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The strung elements to edit.
   */
  strungElements: StrungCircle[];
};

/**
 * Allows editing of the "r" attribute of strung SVG circle elements.
 */
export class RadiusField extends React.Component<Props> {
  onBeforeEdit(event: EditEvent) {
    this.props.app.pushUndo();
  }

  onEdit(event: EditEvent) {
    let newValue = event.newValue;
    // don't make strung elements invisible by default
    if (newValue > 0) {
      let strungElements = this.props.strungElements;
      let types = strungElements.map(ele => ele.type);
      types.forEach(t => {
        defaultSVGElementAttributes[t]['r'] = newValue;
      });
    }

    this.props.app.pushUndo();
  }

  render() {
    let strungElements = this.props.strungElements;
    let svgElements = strungElements.map(svgElementOfStrungElement);

    return (
      <FieldLabel style={{ marginTop: '8px' }} >
        <NumericAttributeInput
          elements={svgElements}
          attributeName='r'
          minValue={0}
          places={2}
          onBeforeEdit={event => this.onBeforeEdit(event)}
          onEdit={event => this.onEdit(event)}
        />
        <span style={{ marginLeft: '8px' }} >
          Radius
        </span>
      </FieldLabel>
    );
  }
}
