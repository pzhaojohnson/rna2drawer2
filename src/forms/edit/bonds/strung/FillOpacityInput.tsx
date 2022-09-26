import type { App } from 'App';

import type { StrungElement } from 'Draw/bonds/strung/StrungElement';

import { defaultStrungTextValues } from 'Draw/bonds/strung/defaults';
import { defaultStrungCircleValues } from 'Draw/bonds/strung/defaults';
import { defaultStrungTriangleValues } from 'Draw/bonds/strung/defaults';
import { defaultStrungRectangleValues } from 'Draw/bonds/strung/defaults';

import { svgElementOfStrungElement } from 'Forms/edit/bonds/strung/svgElementOfStrungElement';

import * as React from 'react';

import { OpacityAttributeInput } from 'Forms/edit/svg/OpacityAttributeInput';
import { EditEvent } from 'Forms/edit/svg/OpacityAttributeInput';

import { generateHTMLCompatibleUUID } from 'Utilities/generateHTMLCompatibleUUID';

const defaultSVGElementAttributes = {
  'StrungText': defaultStrungTextValues.text,
  'StrungCircle': defaultStrungCircleValues.circle,
  'StrungTriangle': defaultStrungTriangleValues.path,
  'StrungRectangle': defaultStrungRectangleValues.path,
};

const baseId = generateHTMLCompatibleUUID();

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The strung elements to edit.
   */
  strungElements: StrungElement[];

  /**
   * The index that the strung elements are at in the strung elements
   * arrays of the bonds possessing them.
   */
  strungElementsIndex: number;

  style?: React.CSSProperties;
};

/**
 * Allows editing of the "fill-opacity" attribute of the SVG element of
 * each strung element.
 */
export class FillOpacityInput extends React.Component<Props> {
  get id(): string {
    // make different for each strung elements index
    return baseId + this.props.strungElementsIndex;
  }

  onBeforeEdit(event: EditEvent) {
    this.props.app.pushUndo();
  }

  onEdit(event: EditEvent) {
    let newValue = event.newValue;
    // don't make strung elements invisible by default
    if (newValue > 0) {
      let strungElements = this.props.strungElements;
      let types = new Set(strungElements.map(ele => ele.type));
      types.forEach(t => {
        defaultSVGElementAttributes[t]['fill-opacity'] = newValue;
      });
    }

    this.props.app.refresh();
  }

  render() {
    let strungElements = this.props.strungElements;
    let svgElements = strungElements.map(svgElementOfStrungElement);

    return (
      <OpacityAttributeInput
        id={this.id}
        elements={svgElements}
        attributeName='fill-opacity'
        places={2}
        onBeforeEdit={event => this.onBeforeEdit(event)}
        onEdit={event => this.onEdit(event)}
        style={this.props.style}
      />
    );
  }
}
