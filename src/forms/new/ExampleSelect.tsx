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
        label: { marginRight: '12px' },
        select: {
          container: { minWidth: '222px' },
          control: { minHeight: '24px' },
        },
      }}
    />
  );
}
