import type { App } from 'App';
import type { Base } from 'Draw/bases/Base';

import * as React from 'react';
import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';
import { NumberingCheckbox } from './NumberingCheckbox';
import { NumberInput } from './numberings/NumberInput';

export type Props = {
  app: App; // a reference to the whole app

  base: Base; // the base to edit
};

export function NumberingField(props: Props) {
  if (!props.base.numbering) {
    return (
      <div style={{ marginTop: '16px', alignSelf: 'start', display: 'flex' }} >
        <FieldLabel style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} >
          <NumberingCheckbox {...props} />
          <span style={{ marginLeft: '6px' }} >
            Numbering
          </span>
        </FieldLabel>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '16px', alignSelf: 'start', display: 'flex' }} >
      <div style={{ display: 'flex', alignItems: 'center' }} >
        <NumberingCheckbox {...props} />
        <span style={{ width: '10px' }} />
        <FieldLabel style={{ display: 'flex', alignItems: 'center', cursor: 'text' }} >
          <NumberInput {...props} baseNumbering={props.base.numbering} />
          <span style={{ marginLeft: '8px' }} >
            Numbering
          </span>
        </FieldLabel>
      </div>
    </div>
  );
}
