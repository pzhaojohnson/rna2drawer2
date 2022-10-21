import type { App } from 'App';

import type { Bond } from 'Forms/edit/bonds/strung/Bond';
import type { StrungText } from 'Draw/bonds/strung/StrungElement';

import { defaultStrungTextValues } from 'Draw/bonds/strung/defaults';

import { svgElementOfStrungElement } from 'Forms/edit/bonds/strung/svgElementOfStrungElement';

import { repositionStrungElementAtIndex } from 'Forms/edit/bonds/strung/repositionStrungElementAtIndex';

import * as React from 'react';

import { FontWeightInput } from 'Forms/edit/svg/FontWeightInput';
import { EditEvent } from 'Forms/edit/svg/FontWeightInput';

import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';

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

  /**
   * The bonds possessing the strung elements.
   */
  bonds: Bond[];

  /**
   * The index that each of the strung elements is at in the strung
   * elements array of the bond that possesses it.
   */
  strungElementsIndex: number;
};

/**
 * Allows editing of the "font-weight" attribute of the SVG element of
 * each of the strung elements.
 */
export class FontWeightField extends React.Component<Props> {
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
        defaultSVGElementAttributes[t]['font-weight'] = newValue;
      });
    }

    this.props.bonds.forEach(bond => {
      repositionStrungElementAtIndex({
        bond,
        index: this.props.strungElementsIndex,
      });
    });

    this.props.app.refresh();
  }

  render() {
    let strungElements = this.props.strungElements;
    let svgElements = strungElements.map(svgElementOfStrungElement);

    let style = {
      marginTop: '8px', minHeight: '20px',
      alignSelf: 'start', display: 'flex', alignItems: 'center',
      cursor: 'pointer',
    };

    return (
      <FieldLabel style={style} >
        <FontWeightInput
          elements={svgElements}
          onBeforeEdit={event => this.onBeforeEdit(event)}
          onEdit={event => this.onEdit(event)}
        />
        <span style={{ marginLeft: '6px' }} >
          Bold
        </span>
      </FieldLabel>
    );
  }
}
