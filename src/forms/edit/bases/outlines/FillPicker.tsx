import type { App } from 'App';

import { CircleBaseAnnotation as BaseOutline } from 'Draw/bases/annotate/circle/CircleBaseAnnotation';

import * as SVG from '@svgdotjs/svg.js';

import * as React from 'react';

import { ColorAttributePicker } from 'Forms/edit/svg/ColorAttributePicker';

import { colorValuesAreEqual } from 'Draw/svg/colorValuesAreEqual';

/**
 * Returns true if the color is white.
 */
function isWhite(color: SVG.Color): boolean {
  return colorValuesAreEqual(color.toHex(), '#ffffff');
}

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The base outlines to edit.
   */
  outlines: BaseOutline[];
}

export function FillPicker(props: Props) {
  return (
    <ColorAttributePicker
      elements={props.outlines.map(o => o.circle)}
      attributeName='fill'
      onBeforeEdit={() => {
        props.app.pushUndo();
      }}
      onEdit={event => {
        let newValue = event.newValue;

        // don't make the same color as the background by default
        if (!isWhite(newValue)) {
          BaseOutline.recommendedDefaults.circle['fill'] = newValue.toHex();
        }

        props.app.refresh(); // refresh after updating all values
      }}
    />
  );
}
