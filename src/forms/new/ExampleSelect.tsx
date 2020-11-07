import * as React from 'react';
import { SelectField } from '../fields/SelectField';

interface Props {
  examples: string[];
  selected: string;
  select: (example: string) => void;
}

export function ExampleSelect(props: Props): React.ReactElement {
  return (
    <SelectField
      name='Example'
      initialValue={props.selected}
      options={props.examples}
      set={ex => props.select(ex)}
      style={{
        label: { marginRight: '8px' },
        select: { control: { minHeight: '22px' } },
      }}
    />
  );
}
