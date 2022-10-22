import type { App } from 'App';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';

import * as React from 'react';

// underlying component and functions
import { StrokeLinecapField as _StrokeLinecapField } from 'Forms/inputs/svg/strokeLinecap/StrokeLinecapField';
import { strokeLinecap as _strokeLinecap } from 'Forms/inputs/svg/strokeLinecap/strokeLinecap';
import { setStrokeLinecap as _setStrokeLinecap } from 'Forms/inputs/svg/strokeLinecap/strokeLinecap';

// returns the line elements of the secondary bonds
function lines(secondaryBonds: SecondaryBond[]) {
  return secondaryBonds.map(secondaryBond => secondaryBond.line);
}

// returns a set of the secondary bond types present
function types(secondaryBonds: SecondaryBond[]) {
  return new Set(secondaryBonds.map(secondaryBond => secondaryBond.type));
}

function strokeLinecap(secondaryBonds: SecondaryBond[]) {
  return _strokeLinecap(lines(secondaryBonds));
}

function setStrokeLinecap(secondaryBonds: SecondaryBond[], value: unknown) {
  _setStrokeLinecap(lines(secondaryBonds), value);
}

export type Props = {

  // a reference to the whole app
  app: App;

  // the secondary bonds to edit
  secondaryBonds: SecondaryBond[];
};

export function StrokeLinecapField(props: Props) {
  return (
    <_StrokeLinecapField
      value={strokeLinecap(props.secondaryBonds)}
      onChange={event => {
        if (event.target.value != strokeLinecap(props.secondaryBonds)) {
          props.app.pushUndo();
          setStrokeLinecap(props.secondaryBonds, event.target.value);
          types(props.secondaryBonds).forEach(t => {
            SecondaryBond.recommendedDefaults[t].line['stroke-linecap'] = event.target.value;
          });
          props.app.refresh();
        }
      }}
      style={{ marginTop: '10px' }}
    />
  );
}
