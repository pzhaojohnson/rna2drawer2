import type { App } from 'App';
import type { BaseNumbering } from 'Draw/bases/number/BaseNumbering';

import * as React from 'react';
import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';
import { NumberInput } from './NumberInput';

export type Props = {
  app: App; // a reference to the whole app

  baseNumberings: BaseNumbering[]; // the base numberings to edit
};

export function NumberField(props: Props) {
  return (
    <div style={{ alignSelf: 'start', display: 'flex' }} >
      <FieldLabel
        style={{
          alignSelf: 'start',
          display: 'flex', flexDirection: 'row', alignItems: 'center',
          cursor: 'text',
        }}
      >
        <NumberInput {...props} />
        <span style={{ marginLeft: '8px' }} >
          Number
        </span>
      </FieldLabel>
      <div style={{ width: '8px' }} />
    </div>
  );
}
