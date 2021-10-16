import * as React from 'react';
import { ColorPicker } from 'Forms/fields/color/ColorPicker';
import colorFieldStyles from 'Forms/fields/color/ColorField.css';
import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import * as SVG from '@svgdotjs/svg.js';
import { parseColor } from 'Parse/svg/color';

// returns undefined if there are no base numberings in the drawing
// or if base numbering texts and lines do not all have the same color
function currColorOfBaseNumberings(drawing: Drawing): SVG.Color | undefined {
  let hexs = new Set<string>();
  drawing.bases().forEach(b => {
    if (b.numbering) {
      let textColor = parseColor(b.numbering.text.attr('fill'));
      if (textColor) {
        hexs.add(textColor.toHex());
      }
      let lineColor = parseColor(b.numbering.line.attr('stroke'));
      if (lineColor) {
        hexs.add(lineColor.toHex());
      }
    }
  });
  if (hexs.size == 1) {
    let hex = hexs.values().next().value;
    return parseColor(hex);
  }
}

function colorsAreEqual(c1: SVG.Color, c2: SVG.Color): boolean {
  return c1.toHex() == c2.toHex();
}

export type Props = {
  app: App;
}

export function ColorField(props: Props) {
  let currColor = currColorOfBaseNumberings(props.app.strictDrawing.drawing);
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <ColorPicker
        value={currColor ? { color: currColor } : undefined}
        onChangeComplete={value => {
          let currColor = currColorOfBaseNumberings(props.app.strictDrawing.drawing);
          if (!currColor || !colorsAreEqual(currColor, value.color)) {
            props.app.pushUndo();
            props.app.strictDrawing.drawing.bases().forEach(b => {
              if (b.numbering) {
                b.numbering.text.attr({ 'fill': value.color.toHex() });
                b.numbering.line.attr({ 'stroke': value.color.toHex() });
              }
            });
            BaseNumbering.recommendedDefaults.text['fill'] = value.color.toHex();
            BaseNumbering.recommendedDefaults.line['stroke'] = value.color.toHex();
            props.app.drawingChangedNotByInteraction();
          }
        }}
        disableAlpha={true}
      />
      <p
        className={`${colorFieldStyles.label} unselectable`}
        style={{ marginLeft: '8px' }}
      >
        Color
      </p>
    </div>
  );
}
