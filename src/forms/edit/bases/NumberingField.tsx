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
  return (
    <FieldLabel
      style={{
        marginTop: '16px',
        display: 'flex', flexDirection: 'row', alignItems: 'center',
      }}
    >
      <NumberingCheckbox {...props} />
      <span style={{ marginRight: props.base.numbering ? '10px' : '0px' }} />
      {!props.base.numbering ? null : (
        <NumberInput {...props} baseNumbering={props.base.numbering} />
      )}
      <span style={{ marginLeft: props.base.numbering ? '8px' : '6px' }} >
        Numbering
      </span>
    </FieldLabel>
  );
}
