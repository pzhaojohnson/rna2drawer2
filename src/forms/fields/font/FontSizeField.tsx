import * as React from 'react';
import { NumberField } from '../../fields/text/NumberField';

interface Props {
  name: string;
  initialValue?: number;
  set: (fs: number) => void;
}

export function FontSizeField(props: Props): React.ReactElement | null {
  return (
    <NumberField
      name={props.name}
      initialValue={props.initialValue}
      checkValue={n => {
        if (n < 1) {
          return 'Font size must be at least 1.';
        }
        return '';
      }}
      set={fs => props.set(fs)}
    />
  );
}
