import type { App } from 'App';
import type { Base } from 'Draw/bases/Base';

import * as React from 'react';
import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';
import { FillPicker } from './FillPicker';
import { FillOpacityInput } from './FillOpacityInput';

export type Props = {
  app: App; // a reference to the whole app

  bases: Base[]; // the bases to edit
};

export function FillField(props: Props) {
  return (
    <div
      style={{
        alignSelf: 'start',
        display: 'flex', flexDirection: 'row', alignItems: 'center',
      }}
    >
      <FillPicker {...props} />
      <FieldLabel
        style={{
          marginLeft: '10px',
          display: 'flex', alignItems: 'center',
          cursor: 'text',
        }}
      >
        <FillOpacityInput {...props} />
        <span style={{ marginLeft: '8px' }} >
          Color
        </span>
      </FieldLabel>
    </div>
  );
}
