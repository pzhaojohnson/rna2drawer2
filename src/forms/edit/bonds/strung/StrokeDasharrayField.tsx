import type { App } from 'App';

import { strokeDasharrayValueEqualsNone as equalsNone } from 'Values/svg/strokeDasharrayValueEqualsNone';

import type { StrungCircle } from 'Draw/bonds/strung/StrungElement';
import type { StrungTriangle } from 'Draw/bonds/strung/StrungElement';
import type { StrungRectangle } from 'Draw/bonds/strung/StrungElement';

import { svgElementOfStrungElement } from 'Forms/edit/bonds/strung/svgElementOfStrungElement';

import * as React from 'react';

// the underlying component
import { StrokeDasharrayField as _StrokeDasharrayField } from 'Forms/edit/svg/StrokeDasharrayField';
import { EditEvent } from 'Forms/edit/svg/StrokeDasharrayField';

import { generateHTMLSafeUUID } from 'Utilities/generateHTMLSafeUUID';

const inputId = generateHTMLSafeUUID();

/**
 * Should be updated on edit and persist between mountings and
 * unmountings.
 */
let defaultDashedValue = '3 1';

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
};

export class StrokeDasharrayField extends React.Component<Props> {
  handleBeforeEdit() {
    this.props.app.pushUndo();
  }

  handleEdit(event: EditEvent) {
    if (!equalsNone(event.newValue)) {
      defaultDashedValue = event.newValue;
    }

    this.props.app.refresh();
  }

  render() {
    let svgElements = this.props.strungElements.map(svgElementOfStrungElement);

    return (
      <_StrokeDasharrayField
        label='Dashed Line'
        elements={svgElements}
        defaultDashedValue={defaultDashedValue}
        onBeforeEdit={() => this.handleBeforeEdit()}
        onEdit={event => this.handleEdit(event)}
        input={{ id: inputId }}
        style={{
          marginTop: '8px',
          minHeight: '22px',
          alignSelf: 'start',
        }}
      />
    );
  }
}
