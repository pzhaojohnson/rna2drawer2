import type { App } from 'App';

import type { StrungCircle } from 'Draw/bonds/strung/StrungElement';
import type { StrungTriangle } from 'Draw/bonds/strung/StrungElement';
import type { StrungRectangle } from 'Draw/bonds/strung/StrungElement';

import { defaultStrungCircleValues } from 'Draw/bonds/strung/defaults';
import { defaultStrungTriangleValues } from 'Draw/bonds/strung/defaults';
import { defaultStrungRectangleValues } from 'Draw/bonds/strung/defaults';

import { svgElementOfStrungElement } from 'Forms/edit/bonds/strung/svgElementOfStrungElement';

import * as React from 'react';

import { OpacityAttributeInput } from 'Forms/edit/svg/OpacityAttributeInput';
import { EditEvent } from 'Forms/edit/svg/OpacityAttributeInput';

import { generateHTMLSafeUUID } from 'Utilities/generateHTMLSafeUUID';

const defaultSVGElementAttributes = {
  'StrungCircle': defaultStrungCircleValues.circle,
  'StrungTriangle': defaultStrungTriangleValues.path,
  'StrungRectangle': defaultStrungRectangleValues.path,
};

const baseId = generateHTMLSafeUUID();

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The strung elements to edit.
   */
  strungElements: (
    StrungCircle
    | StrungTriangle
    | StrungRectangle
  )[];

  /**
   * The index that the strung elements are at in the strung elements
   * arrays of the bonds that possess them.
   */
  strungElementsIndex: number;

  style?: React.CSSProperties;
};

/**
 * Allows editing of the "stroke-opacity" attribute of the SVG element
 * of each strung element.
 */
export class StrokeOpacityInput extends React.Component<Props> {
  get id(): string {
    // make different for each strung elements index
    return baseId + this.props.strungElementsIndex;
  }

  onBeforeEdit(event: EditEvent) {
    this.props.app.pushUndo();
  }

  onEdit(event: EditEvent) {
    let newValue = event.newValue;
    let strungElements = this.props.strungElements;
    let types = new Set(strungElements.map(ele => ele.type));
    types.forEach(t => {
      defaultSVGElementAttributes[t]['stroke-opacity'] = newValue;
    });

    this.props.app.refresh();
  }

  render() {
    let strungElements = this.props.strungElements;
    let svgElements = strungElements.map(svgElementOfStrungElement);

    return (
      <OpacityAttributeInput
        id={this.id}
        elements={svgElements}
        attributeName='stroke-opacity'
        places={2}
        onBeforeEdit={event => this.onBeforeEdit(event)}
        onEdit={event => this.onEdit(event)}
        style={this.props.style}
      />
    );
  }
}
