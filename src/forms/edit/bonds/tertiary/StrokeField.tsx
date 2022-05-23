import type { App } from 'App';
import type { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

import * as React from 'react';
import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';
import { StrokePicker } from './StrokePicker';
import { StrokeOpacityInput } from './StrokeOpacityInput';

export type Props = {
  app: App; // a reference to the whole app

  // the tertiary bonds to edit
  tertiaryBonds: TertiaryBond[];
};

export function StrokeField(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <StrokePicker {...props} />
      <FieldLabel style={{ marginLeft: '10px', alignSelf: 'start', cursor: 'text' }} >
        <StrokeOpacityInput {...props} />
        Color
      </FieldLabel>
    </div>
  );
}
