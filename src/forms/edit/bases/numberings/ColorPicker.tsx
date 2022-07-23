import type { App } from 'App';
import { BaseNumbering } from 'Draw/bases/numberings/BaseNumbering';

import * as SVG from '@svgdotjs/svg.js';
import { fill } from 'Forms/inputs/svg/fill/fill';
import { fillEquals } from 'Forms/inputs/svg/fill/fill';
import { setFill } from 'Forms/inputs/svg/fill/fill';
import { setStroke } from 'Forms/inputs/svg/stroke/stroke';

import * as React from 'react';
import { ColorPicker as _ColorPicker } from 'Forms/inputs/color/ColorPicker';

// returns the text elements of the base numberings
function texts(baseNumberings: BaseNumbering[]): SVG.Text[] {
  return baseNumberings.map(bn => bn.text);
}

// returns the line elements of the base numberings
function lines(baseNumberings: BaseNumbering[]): SVG.Line[] {
  return baseNumberings.map(bn => bn.line);
}

export type Props = {

  // a reference to the whole app
  app: App;

  // the base numberings to edit
  baseNumberings: BaseNumbering[];
}

export function ColorPicker(props: Props) {
  return (
    <_ColorPicker
      // assumes that texts fill is the same as lines stroke
      value={fill(texts(props.baseNumberings))}
      onClose={event => {
        if (!event.target.value) {
          return;
        } else if (fillEquals(texts(props.baseNumberings), event.target.value.color)) {
          return;
        }

        props.app.pushUndo();
        setFill(texts(props.baseNumberings), event.target.value.color);
        setStroke(lines(props.baseNumberings), event.target.value.color);
        BaseNumbering.recommendedDefaults.text['fill'] = event.target.value.color.toHex();
        BaseNumbering.recommendedDefaults.line['stroke'] = event.target.value.color.toHex();
        props.app.refresh();
      }}
      disableAlpha={true}
    />
  );
}
