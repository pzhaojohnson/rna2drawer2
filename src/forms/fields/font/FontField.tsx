import * as React from 'react';
import { SelectField } from '../SelectField';
import { availableFonts } from './availableFonts';

interface Props {
  name: string;
  initialValue?: string;
  set: (f: string) => void;
}

export function FontField(props: Props): React.ReactElement {
  return (
    <SelectField
      name={props.name}
      initialValue={props.initialValue}
      options={availableFonts()}
      set={f => props.set(f)}
    />
  );
}
