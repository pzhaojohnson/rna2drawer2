import type { App } from 'App';
import type { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';

import * as React from 'react';
import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';
import { StrokePicker } from './StrokePicker';
import { StrokeOpacityInput } from './StrokeOpacityInput';

export type Props = {
  app: App; // a reference to the whole app

  // the primary bonds to edit
  primaryBonds: PrimaryBond[];
};

export function StrokeField(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <StrokePicker {...props} />
      <FieldLabel style={{ marginLeft: '10px', cursor: 'text' }} >
        <StrokeOpacityInput {...props} />
        Color
      </FieldLabel>
    </div>
  );
}
