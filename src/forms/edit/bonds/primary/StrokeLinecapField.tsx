import type { App } from 'App';
import type { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';

import * as React from 'react';

// underlying component and functions
import { StrokeLinecapField as _StrokeLinecapField } from 'Forms/inputs/svg/StrokeLinecapField';
import { strokeLinecap as _strokeLinecap } from 'Forms/inputs/svg/strokeLinecap';
import { setStrokeLinecap as _setStrokeLinecap } from 'Forms/inputs/svg/strokeLinecap';

// returns the line elements of the primary bonds
function lines(primaryBonds: PrimaryBond[]) {
  return primaryBonds.map(primaryBond => primaryBond.line);
}

function strokeLinecap(primaryBonds: PrimaryBond[]) {
  return _strokeLinecap(lines(primaryBonds));
}

function setStrokeLinecap(primaryBonds: PrimaryBond[], value: unknown) {
  _setStrokeLinecap(lines(primaryBonds), value);
}

export type Props = {

  // a reference to the whole app
  app: App;

  // the primary bonds to edit
  primaryBonds: PrimaryBond[];
};

export function StrokeLinecapField(props: Props) {
  return (
    <_StrokeLinecapField
      value={strokeLinecap(props.primaryBonds)}
      onChange={event => {
        if (event.target.value != strokeLinecap(props.primaryBonds)) {
          props.app.pushUndo();
          setStrokeLinecap(props.primaryBonds, event.target.value);
          props.app.refresh();
        }
      }}
    />
  );
}
