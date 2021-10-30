import * as React from 'react';
import { Checkbox } from 'Forms/fields/checkbox/Checkbox';
import checkboxFieldStyles from 'Forms/fields/checkbox/CheckboxField.css';
import { AppInterface as App } from 'AppInterface';
import { BaseInterface } from 'Draw/bases/BaseInterface';
import { Base } from 'Draw/bases/Base';
import { parseNumber } from 'Parse/svg/number';

function isBlankString(v: unknown): boolean {
  return typeof v == 'string' && v.trim().length == 0;
}

function isBold(b: BaseInterface): boolean {
  let fw = b.text.attr('font-weight');
  if (fw == undefined || isBlankString(fw)) {
    return false;
  } else if (fw == 'bold') {
    return true;
  } else {
    let n = parseNumber(fw);
    if (n) {
      return n.valueOf() >= 550;
    } else {
      return false;
    }
  }
}

function areAllBold(bs: BaseInterface[]): boolean {
  return bs.filter(b => !isBold(b)).length == 0;
}

export type Props = {
  app: App;

  // the bases to edit
  bases: BaseInterface[];
}

export function BoldField(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <Checkbox
        checked={areAllBold(props.bases)}
        onChange={event => {
          props.app.pushUndo();
          let fw = event.target.checked ? 700 : 400;
          props.bases.forEach(b => {

            // remember center coordinates
            let bbox = b.text.bbox();
            let center = { x: bbox.cx, y: bbox.cy };

            b.text.attr({ 'font-weight': fw });

            // recenter
            b.text.center(center.x, center.y);
          });
          Base.recommendedDefaults.text['font-weight'] = fw;
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
