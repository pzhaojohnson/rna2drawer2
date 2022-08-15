import type { App } from 'App';

import type { StrungCircle } from 'Draw/bonds/strung/StrungElement';
import type { StrungTriangle } from 'Draw/bonds/strung/StrungElement';
import type { StrungRectangle } from 'Draw/bonds/strung/StrungElement';

import * as React from 'react';

import { StrokeColorPicker } from 'Forms/edit/bonds/strung/StrokeColorPicker';
import { StrokeOpacityInput } from 'Forms/edit/bonds/strung/StrokeOpacityInput';
import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';

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

/**
 * Allows editing of the "stroke" and "stroke-opacity" attributes of the
 * SVG element of each strung element.
 *
 * Can only assign color values to the "stroke" attribute.
 */
export function StrokeColorField(props: Props) {
  return (
    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center' }} >
      <StrokeColorPicker {...props} />
      <FieldLabel
        style={{ marginLeft: '6px', display: 'flex', alignItems: 'center' }}
      >
        <StrokeOpacityInput {...props} />
        <span style={{ marginLeft: '8px' }} >
          Line Color
        </span>
      </FieldLabel>
    </div>
  );
}
