import * as React from 'react';
import { SelectField } from '../SelectField';
import { availableFontFamilies } from './availableFontFamilies';

interface Props {
  name: string;
  initialValue?: string;
  set: (f: string) => void;
}

export function FontFamilyField(props: Props): React.ReactElement {
  return (
    <SelectField
      name={props.name}
      initialValue={props.initialValue}
      options={availableFontFamilies()}
      set={f => props.set(f)}
    />
  );
}
