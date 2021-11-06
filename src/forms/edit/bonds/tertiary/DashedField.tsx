import * as React from 'react';
import { Checkbox } from 'Forms/fields/checkbox/Checkbox';
import checkboxFieldStyles from 'Forms/fields/checkbox/CheckboxField.css';
import { AppInterface as App } from 'AppInterface';
import { TertiaryBondInterface } from 'Draw/bonds/curved/TertiaryBondInterface';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

export type Props = {
  app: App;

  // the tertiary bonds to edit
  tertiaryBonds: TertiaryBondInterface[];
}

function isDashed(tb: TertiaryBondInterface): boolean {
  let sda = tb.path.attr('stroke-dasharray');
  if (typeof sda == 'string') {
    sda = sda.trim().toLowerCase();
    return sda != '' && sda != 'none';
  } else {
    return false;
  }
}

function areAllDashed(tbs: TertiaryBondInterface[]): boolean {
  return tbs.filter(tb => !isDashed(tb)).length == 0;
}

export function DashedField(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <Checkbox
        checked={areAllDashed(props.tertiaryBonds)}
        onChange={event => {
          props.app.pushUndo();
          let sda = event.target.checked ? TertiaryBond.dashedStrokeDasharray : '';
          props.tertiaryBonds.forEach(tb => {
            tb.path.attr({ 'stroke-dasharray': sda });
          });
          TertiaryBond.recommendedDefaults.path['stroke-dasharray'] = sda;
          props.app.refresh();
        }}
      />
      <p
        className={`${checkboxFieldStyles.label} unselectable`}
        style={{ marginLeft: '6px' }}
      >
        Dashed
      </p>
    </div>
  );
}
