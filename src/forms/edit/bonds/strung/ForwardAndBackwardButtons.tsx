import type { App } from 'App';

import type { StrungElement } from 'Draw/bonds/strung/StrungElement';

import { svgElementOfStrungElement } from 'Forms/edit/bonds/strung/svgElementOfStrungElement';

import * as React from 'react';

// the underlying forward and backward buttons component
import { ForwardBackwardButtons as _ForwardAndBackwardButtons } from 'Forms/buttons/ForwardBackwardButtons';

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The strung elements to edit.
   */
  strungElements: StrungElement[];
};

export function ForwardAndBackwardButtons(props: Props) {
  return (
    <_ForwardAndBackwardButtons
      bringToFront={() => {
        props.app.pushUndo();
        props.strungElements.forEach(strungElement => {
          let svgElement = svgElementOfStrungElement(strungElement);
          svgElement.front();
        });
        props.app.refresh();
      }}
      sendToBack={() => {
        props.app.pushUndo();
        props.strungElements.forEach(strungElement => {
          let svgElement = svgElementOfStrungElement(strungElement);
          svgElement.back();
        });
        props.app.refresh();
      }}
      style={{ marginTop: '12px' }}
    />
  );
}
