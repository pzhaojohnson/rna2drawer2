import type { App } from 'App';

import type { StrungText } from 'Draw/bonds/strung/StrungElement';
import { defaultStrungTextValues } from 'Draw/bonds/strung/defaults';

import { svgElementOfStrungElement } from 'Forms/edit/bonds/strung/svgElementOfStrungElement';

import * as React from 'react';

// the underlying font family select component
import { FontFamilySelect as _FontFamilySelect } from 'Forms/edit/svg/FontFamilySelect';
import { EditEvent } from 'Forms/edit/svg/FontFamilySelect';

const defaultSVGElementAttributes = {
  'StrungText': defaultStrungTextValues.text,
};

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The strung elements to edit.
   */
  strungElements: StrungText[];
};

/**
 * Allows editing of the "font-family" attribute of the SVG element of
 * each of the strung elements.
 */
export class FontFamilySelect extends React.Component<Props> {
  onBeforeEdit(event: EditEvent) {
    this.props.app.pushUndo();
  }

  onEdit(event: EditEvent) {
    let newValue = event.newValue;
    let strungElements = this.props.strungElements;
    let types = new Set(strungElements.map(ele => ele.type));
    types.forEach(t => {
      defaultSVGElementAttributes[t]['font-family'] = newValue;
    });

    this.props.app.refresh();
  }

  render() {
    let strungElements = this.props.strungElements;
    let svgElements = strungElements.map(svgElementOfStrungElement);

    return (
      <_FontFamilySelect
        elements={svgElements}
        onBeforeEdit={event => this.onBeforeEdit(event)}
        onEdit={event => this.onEdit(event)}
      />
    );
  }
}
