import type { App } from 'App';
import type { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';

import * as React from 'react';
import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';
import { StrokePicker } from './StrokePicker';
import { StrokeOpacityInput } from './StrokeOpacityInput';

export type Props = {
  app: App; // a reference to the whole app

  secondaryBonds: SecondaryBond[]; // the secondary bonds to edit
};

export function StrokeField(props: Props) {
  return (
    <div
      style={{
        alignSelf: 'start',
        display: 'flex', flexDirection: 'row', alignItems: 'center',
      }}
    >
      <StrokePicker {...props} />
      <FieldLabel style={{ marginLeft: '10px', cursor: 'text' }} >
        <StrokeOpacityInput {...props} />
        <span style={{ marginLeft: '8px' }} >
          Color
        </span>
      </FieldLabel>
    </div>
  );
}
