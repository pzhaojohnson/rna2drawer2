import type { App } from 'App';

import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';

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
   * The primary bonds to edit.
   */
  primaryBonds: PrimaryBond[];
}

export function StrokePicker(props: Props) {
  return (
    <ColorAttributePicker
      elements={props.primaryBonds.map(pb => pb.line)}
      attributeName='stroke'
      onBeforeEdit={() => {
        props.app.pushUndo();
      }}
      onEdit={event => {
        let newValue = event.newValue;

        // don't make the same color as the background by default
        if (!isWhite(newValue)) {
          PrimaryBond.recommendedDefaults.line['stroke'] = newValue.toHex();
        }

        props.app.refresh(); // refresh after updating all values
      }}
    />
  );
}
