import * as React from 'react';
import { Checkbox } from 'Forms/inputs/checkbox/Checkbox';
import checkboxFieldStyles from 'Forms/inputs/checkbox/CheckboxField.css';
import type { App } from 'App';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';

export type Props = {
  app: App;

  // the base numberings to edit
  baseNumberings: BaseNumbering[];
}

function isBold(bn: BaseNumbering): boolean {
  let fw = bn.text.attr('font-weight');
  if (typeof fw == 'string') {
    return fw == 'bold';
  } else if (typeof fw == 'number') {
    return fw >= 700;
  } else {
    return false;
  }
}

function areAllBold(baseNumberings: BaseNumbering[]): boolean {
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
