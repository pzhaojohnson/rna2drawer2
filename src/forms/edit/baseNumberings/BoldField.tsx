import * as React from 'react';
import { Checkbox } from 'Forms/fields/checkbox/Checkbox';
import checkboxFieldStyles from 'Forms/fields/checkbox/CheckboxField.css';
import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { BaseNumberingInterface } from 'Draw/bases/number/BaseNumberingInterface';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';

function isBold(bn: BaseNumberingInterface): boolean {
  let fw = bn.text.attr('font-weight');
  if (typeof fw == 'string') {
    return fw == 'bold';
  } else if (typeof fw == 'number') {
    return fw >= 700;
  } else {
    return false;
  }
}

function allBaseNumberingsAreBold(drawing: Drawing): boolean {
  let allAreBold = true;
  drawing.bases().forEach(b => {
    if (b.numbering && !isBold(b.numbering)) {
      allAreBold = false;
    }
  });
  return allAreBold;
}

export type Props = {
  app: App;
}

export function BoldField(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <Checkbox
        checked={allBaseNumberingsAreBold(props.app.strictDrawing.drawing)}
        onChange={event => {
          props.app.pushUndo();
          let fw = event.target.checked ? 700 : 400;
          props.app.strictDrawing.drawing.bases().forEach(b => {
            if (b.numbering) {
              b.numbering.text.attr({ 'font-weight': fw });
              b.numbering.reposition();
            }
          });
          BaseNumbering.recommendedDefaults.text['font-weight'] = fw;
          props.app.drawingChangedNotByInteraction();
        }}
      />
      <p
        className={`${checkboxFieldStyles.label} unselectable`}
        style={{ marginLeft: '6px' }}
      >
        Bold
      </p>
    </div>
  );
}
