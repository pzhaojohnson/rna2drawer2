import * as React from 'react';
import { CheckboxField } from 'Forms/inputs/checkbox/CheckboxField';
import type { App } from 'App';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

export type Props = {
  app: App;

  // the tertiary bonds to edit
  tertiaryBonds: TertiaryBond[];
}

function isDashed(tb: TertiaryBond): boolean {
  let sda = tb.path.attr('stroke-dasharray');
  if (typeof sda == 'string') {
    sda = sda.trim().toLowerCase();
    return sda != '' && sda != 'none';
  } else {
    return false;
  }
}

function areAllDashed(tbs: TertiaryBond[]): boolean {
  return tbs.filter(tb => !isDashed(tb)).length == 0;
}

export function DashedField(props: Props) {
  return (
    <CheckboxField
      label='Dashed'
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
  );
}
