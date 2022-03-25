import * as React from 'react';
import { Checkbox } from 'Forms/fields/checkbox/Checkbox';
import checkboxFieldStyles from 'Forms/fields/checkbox/CheckboxField.css';
import type { App } from 'App';
import { BaseNumberingInterface } from 'Draw/bases/number/BaseNumberingInterface';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';

export type Props = {
  app: App;

  // the base numberings to edit
  baseNumberings: BaseNumberingInterface[];
}

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

function areAllBold(baseNumberings: BaseNumberingInterface[]): boolean {
  return baseNumberings.filter(bn => !isBold(bn)).length == 0;
}

export function BoldField(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <Checkbox
        checked={areAllBold(props.baseNumberings)}
        onChange={event => {
          props.app.pushUndo();
          let fw = event.target.checked ? 700 : 400;
          props.baseNumberings.forEach(bn => {
            bn.text.attr({ 'font-weight': fw });
            bn.reposition();
          });
          BaseNumbering.recommendedDefaults.text['font-weight'] = fw;
          props.app.refresh();
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
